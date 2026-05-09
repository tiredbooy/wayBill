import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

import {
  useCreateWaybill,
  useUpdateWaybill,
} from "@/_libs/services/queries/waybills.queries";
import { useCustomers } from "@/_libs/services/queries/customer.queries";
import { useDrivers } from "@/_libs/services/queries/drivers.queries";
import { useVehicles } from "@/_libs/services/queries/vehicles.queries";
import { useLocations } from "@/_libs/services/queries/locations.queries";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormCommandSelect } from "@/features/reusable/form-inputs/CommandSelect";
import { FormJalaliDatePicker } from "@/features/reusable/form-inputs/FormDatePicker";
import { FormCheckbox } from "@/features/reusable/form-inputs/FormCheckbox";

import CreateCustomerModal from "@/features/customers/create-customer/CreateCustomerModal";
import CreateDriverModal from "@/features/drivers/create-driver/CreateDriverModal";
import CreateVehicleModal from "@/features/vehicles/CreateVehicleModal";
import CreateLocationModal from "@/features/locations/CreateLocationModal";

import type { WaybillDetail } from "@/_libs/types/waybill-types";
import type { CustomerDetail } from "@/_libs/types/customer-types";
import type { DriverResponse } from "@/_libs/types/driver-types";
import type { VehicleResponse } from "@/_libs/types/vehicle-types";
import type { LocationDetail } from "@/_libs/types/location-types";

interface Props {
  mode: "edit" | "create";
  waybill?: WaybillDetail;
  onSuccess?: () => void;
}

const waybillSchema = z.object({
  waybill_number: z.string().optional(),
  issue_date: z.string().min(1, "تاریخ صدور الزامی است"),
  dispatch_date: z.string().min(1, "تاریخ بارگیری الزامی است"),
  actual_delivery_date: z.string().optional(),
  status: z.string().optional(),
  sender_id: z.string().min(1, "فرستنده الزامی است"),
  receiver_id: z.string().min(1, "گیرنده الزامی است"),
  driver_id: z.string().min(1, "راننده الزامی است"),
  vehicle_id: z.string().min(1, "وسیله نقلیه الزامی است"),
  origin_location_id: z.string().min(1, "مبدا الزامی است"),
  destination_location_id: z.string().min(1, "مقصد الزامی است"),
  total_weight: z.string().optional(),
  total_packages: z.string().optional(),
  description: z.string().optional(),
  freight_charge: z.string().optional(),
  have_insurance: z.boolean().optional(),
  insurance_amount: z.string().optional(),
  other_charges: z.string().optional(),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
});

type WaybillFormValues = z.infer<typeof waybillSchema>;

export function WaybillForm({ mode = "create", waybill }: Props) {
  // Search states
  const [senderSearch, setSenderSearch] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [originSearch, setOriginSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");

  // Modal states
  const [senderOpen, setSenderOpen] = useState(false);
  const [receiverOpen, setReceiverOpen] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);

  // Data fetching
  const { data: senders, isLoading: sendersLoading } = useCustomers({
    q: senderSearch,
  });
  const { data: receivers, isLoading: receiversLoading } = useCustomers({
    q: receiverSearch,
  });
  const { data: drivers, isLoading: driversLoading } = useDrivers({
    q: driverSearch,
  });
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles({
    q: vehicleSearch,
  });
  const { data: locations, isLoading: locationsLoading } = useLocations({
    q: originSearch,
  });

  const createWaybill = useCreateWaybill();
  const updateWaybill = useUpdateWaybill();

  const form = useForm<WaybillFormValues>({
    resolver: zodResolver(waybillSchema),
    defaultValues: {
      waybill_number: waybill?.waybill_number ?? "",
      issue_date: waybill?.issue_date ?? "",
      dispatch_date: waybill?.dispatch_date ?? "",
      actual_delivery_date: waybill?.actual_delivery_date ?? "",
      status: waybill?.status ?? "",
      sender_id: waybill?.sender_id ? String(waybill.sender_id) : "",
      receiver_id: waybill?.receiver_id ? String(waybill.receiver_id) : "",
      driver_id: waybill?.driver_id ? String(waybill.driver_id) : "",
      vehicle_id: waybill?.vehicle_id ? String(waybill.vehicle_id) : "",
      origin_location_id: waybill?.origin_location_id
        ? String(waybill.origin_location_id)
        : "",
      destination_location_id: waybill?.destination_location_id
        ? String(waybill.destination_location_id)
        : "",
      total_weight: waybill?.total_weight ? String(waybill.total_weight) : "",
      total_packages: waybill?.total_packages
        ? String(waybill.total_packages)
        : "",
      description: waybill?.description ?? "",
      freight_charge: waybill?.freight_charge
        ? String(waybill.freight_charge)
        : "",
      have_insurance: waybill?.have_insurance ?? false,
      insurance_amount: waybill?.insurance_amount
        ? String(waybill.insurance_amount)
        : "",
      other_charges: waybill?.other_charges
        ? String(waybill.other_charges)
        : "",
      payment_status: waybill?.payment_status ?? "",
      notes: waybill?.notes ?? "",
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = form;

  const haveInsurance = watch("have_insurance");
  const selectedDriverId = watch("driver_id");

  useEffect(() => {
    if (!selectedDriverId || !drivers?.results) return;
    const driver = drivers.results.find(
      (d: DriverResponse) => d.id === Number(selectedDriverId),
    );
    if (driver?.vehicle_id) {
      setValue("vehicle_id", String(driver?.vehicle_id));
    } else {
      setValue("vehicle_id", String(0));
    }
  }, [selectedDriverId, drivers, setValue]);

  // Helper to map options
  const mapCustomerOptions = (customers: CustomerDetail[]) =>
    customers?.map((c) => ({ label: c.name, value: String(c.id) })) ?? [];
  const mapDriverOptions = (drivers: DriverResponse[]) =>
    drivers?.map((d) => ({
      label: `${d.first_name} ${d.last_name}`,
      value: String(d.id),
    })) ?? [];
  const mapVehicleOptions = (vehicles: VehicleResponse[]) =>
    vehicles?.map((v) => ({ label: v.model, value: String(v.id) })) ?? [];
  const mapLocationOptions = (locations: LocationDetail[]) =>
    locations?.map((l) => ({ label: l.name, value: String(l.id) })) ?? [];

  const onSubmit = async (data: WaybillFormValues) => {
    // Convert to the API expected format (numbers)
    const payload = {
      ...data,
      sender_id: data.sender_id ? Number(data.sender_id) : 0,
      receiver_id: data.receiver_id ? Number(data.receiver_id) : 0,
      driver_id: data.driver_id ? Number(data.driver_id) : 0,
      vehicle_id: data.vehicle_id ? Number(data.vehicle_id) : 0,
      origin_location_id: data.origin_location_id
        ? Number(data.origin_location_id)
        : 0,
      destination_location_id: data.destination_location_id
        ? Number(data.destination_location_id)
        : 0,
      total_weight: data.total_weight ? Number(data.total_weight) : undefined,
      total_packages: data.total_packages
        ? Number(data.total_packages)
        : undefined,
      freight_charge: data.freight_charge
        ? Number(data.freight_charge)
        : undefined,
      insurance_amount: data.insurance_amount
        ? Number(data.insurance_amount)
        : undefined,
      other_charges: data.other_charges
        ? Number(data.other_charges)
        : undefined,
    };

    if (mode === "create") {
      await createWaybill.mutateAsync(payload);
      reset();
    } else if (mode === "edit" && waybill?.id) {
      await updateWaybill.mutateAsync({ data: payload, waybillId: waybill.id });
    }
  };

  const isPending =
    createWaybill.isPending ||
    updateWaybill.isPending ||
    isSubmitting ||
    sendersLoading ||
    receiversLoading ||
    driversLoading ||
    vehiclesLoading ||
    locationsLoading;

  const selectedDriver = drivers?.results?.find(
    (d) => d.id === Number(selectedDriverId),
  );
  const isVehicleFixed = !!selectedDriver?.vehicle_id;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Basic Info */}
          <FormInput
            control={control}
            name="waybill_number"
            label="شماره بارنامه"
            error={errors.waybill_number?.message}
          />
          <FormJalaliDatePicker
            outputType="iso"
            control={control}
            name="issue_date"
            label="تاریخ صدور"
          />
          <FormJalaliDatePicker
            outputType="iso"
            control={control}
            name="dispatch_date"
            label="تاریخ بارگیری"
          />
          <FormJalaliDatePicker
            outputType="iso"
            control={control}
            name="actual_delivery_date"
            label="تاریخ تحویل"
          />
          <FormInput
            control={control}
            name="status"
            label="وضعیت"
            placeholder="در انتظار / در مسیر / تحویل شده"
            error={errors.status?.message}
          />

          {/* Entities */}
          <FormCommandSelect
            control={control}
            searchValue={senderSearch}
            onSearchChange={setSenderSearch}
            name="sender_id"
            label="فرستنده"
            options={mapCustomerOptions(senders?.results ?? [])}
            onAddNew={() => setSenderOpen(true)}
            loading={sendersLoading}
          />
          <FormCommandSelect
            control={control}
            searchValue={receiverSearch}
            onSearchChange={setReceiverSearch}
            name="receiver_id"
            label="گیرنده"
            options={mapCustomerOptions(receivers?.results ?? [])}
            onAddNew={() => setReceiverOpen(true)}
            loading={receiversLoading}
          />
          <FormCommandSelect
            control={control}
            searchValue={driverSearch}
            onSearchChange={setDriverSearch}
            name="driver_id"
            label="راننده"
            options={mapDriverOptions(drivers?.results ?? [])}
            onAddNew={() => setDriverOpen(true)}
            loading={driversLoading}
          />
          <FormCommandSelect
            control={control}
            searchValue={vehicleSearch}
            onSearchChange={setVehicleSearch}
            name="vehicle_id"
            label="وسیله نقلیه"
            options={mapVehicleOptions(vehicles?.results ?? [])}
            onAddNew={() => setVehicleOpen(true)}
            loading={vehiclesLoading}
            disabled={isVehicleFixed}
          />
          <FormCommandSelect
            control={control}
            searchValue={originSearch}
            onSearchChange={setOriginSearch}
            name="origin_location_id"
            label="مبدا"
            options={mapLocationOptions(locations ?? [])}
            onAddNew={() => setOriginOpen(true)}
            loading={locationsLoading}
          />
          <FormCommandSelect
            control={control}
            searchValue={destSearch}
            onSearchChange={setDestSearch}
            name="destination_location_id"
            label="مقصد"
            options={mapLocationOptions(locations ?? [])}
            onAddNew={() => setDestOpen(true)}
            loading={locationsLoading}
          />

          {/* Cargo details */}
          <FormInput
            control={control}
            name="total_weight"
            label="وزن کل (کیلوگرم)"
            type="number"
            error={errors.total_weight?.message}
          />
          <FormInput
            control={control}
            name="total_packages"
            label="تعداد بسته‌ها"
            type="number"
            error={errors.total_packages?.message}
          />
          <FormInput
            control={control}
            name="description"
            label="شرح محموله"
            error={errors.description?.message}
          />

          {/* Financial section */}
          <FormInput
            control={control}
            name="freight_charge"
            label="کرایه حمل"
            type="number"
            error={errors.freight_charge?.message}
          />
          <div className="col-span-full">
            <FormCheckbox
              control={control}
              name="have_insurance"
              label="دارای بیمه نامه"
            />
          </div>
          {haveInsurance && (
            <FormInput
              control={control}
              name="insurance_amount"
              label="مبلغ بیمه"
              type="number"
              error={errors.insurance_amount?.message}
            />
          )}
          <FormInput
            control={control}
            name="other_charges"
            label="سایر هزینه‌ها"
            type="number"
            error={errors.other_charges?.message}
          />
          <FormInput
            control={control}
            name="payment_status"
            label="وضعیت پرداخت"
            error={errors.payment_status?.message}
          />
          <FormInput
            control={control}
            name="notes"
            label="یادداشت"
            error={errors.notes?.message}
          />

          <div className="col-span-full">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Spinner />
              ) : mode === "create" ? (
                "ثبت بارنامه"
              ) : (
                "ویرایش بارنامه"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Modals */}
      <CreateCustomerModal
        open={senderOpen}
        onOpenChange={setSenderOpen}
        shouldNavigate={false}
      />
      <CreateCustomerModal
        open={receiverOpen}
        onOpenChange={setReceiverOpen}
        shouldNavigate={false}
      />
      <CreateDriverModal
        open={driverOpen}
        onOpenChange={setDriverOpen}
        shouldNavigate={false}
      />
      <CreateVehicleModal
        open={vehicleOpen}
        onOpenChange={setVehicleOpen}
        shouldNavigate={false}
      />
      <CreateLocationModal
        open={originOpen}
        onOpenChange={setOriginOpen}
        shouldNavigate={false}
      />
      <CreateLocationModal
        open={destOpen}
        onOpenChange={setDestOpen}
        shouldNavigate={false}
      />
    </>
  );
}
