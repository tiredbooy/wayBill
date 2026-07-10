import {
  useForm,
  type FieldErrors,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { BasicInfoSection } from "./BasicInfoSection";
import { EntitiesSection } from "./EntitiesSection";
import { CargoSection } from "./CargoSection";
import { FinancialSection } from "./FinancialSection";
import { useEntityPicker, toItems } from "@/hooks/use-entity-picker";

import CreateCustomerModal from "@/features/customers/create-customer/CreateCustomerModal";
import CreateDriverModal from "@/features/drivers/create-driver/CreateDriverModal";
import CreateVehicleModal from "@/features/vehicles/CreateVehicleModal";
import CreateLocationModal from "@/features/locations/CreateLocationModal";

import { waybillSchema } from "./schema";
import type { WaybillFormValues } from "./schema";
import type { WaybillDetail } from "@/_libs/types/waybill-types";
import type { DriverResponse } from "@/_libs/types/driver-types";

interface Props {
  mode: "edit" | "create";
  waybill?: WaybillDetail;
  onSuccess?: () => void;
}

const fieldLabels: Record<string, string> = {
  issue_date: "تاریخ صدور",
  dispatch_date: "تاریخ بارگیری",
  actual_delivery_date: "تاریخ تحویل واقعی",
  status: "وضعیت",
  sender_id: "فرستنده",
  receiver_id: "گیرنده",
  driver_id: "راننده",
  vehicle_id: "وسیله نقلیه",
  origin_location_id: "مبدا",
  destination_location_id: "مقصد",
  total_weight: "وزن کل",
  total_packages: "تعداد بسته",
  description: "شرح محموله",
  freight_charge: "کرایه حمل",
  insurance_amount: "مبلغ بیمه",
  other_charges: "سایر هزینه‌ها",
  payment_status: "وضعیت پرداخت",
  notes: "یادداشت‌ها",
};

export function WaybillForm({ mode = "create", waybill, onSuccess }: Props) {
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const sender = useEntityPicker();
  const receiver = useEntityPicker();
  const driver = useEntityPicker();
  const vehicle = useEntityPicker();
  const origin = useEntityPicker();
  const destination = useEntityPicker();

  const { data: senders, isLoading: sendersLoading } = useCustomers({
    q: sender.search,
  });
  const { data: receivers, isLoading: receiversLoading } = useCustomers({
    q: receiver.search,
  });
  const { data: drivers, isLoading: driversLoading } = useDrivers({
    q: driver.search,
  });
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles({
    q: vehicle.search,
  });
  const { data: originLocations, isLoading: originLoading } = useLocations({
    q: origin.search,
  });
  const { data: destLocations, isLoading: destLoading } = useLocations({
    q: destination.search,
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
    mode: "onSubmit",
  });

  const {
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    setFocus,
  } = form;

  const haveInsurance = watch("have_insurance");
  const selectedDriverId = watch("driver_id");

  // Only auto-fill vehicle_id the first time a given driver is selected,
  // not every time the drivers list refetches (e.g. while typing a search).
  const lastAppliedDriverId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedDriverId || selectedDriverId === lastAppliedDriverId.current)
      return;

    const driverList = toItems<DriverResponse>(drivers);
    const selected = driverList.find((d) => d.id === Number(selectedDriverId));
    if (selected?.vehicle_id) {
      setValue("vehicle_id", String(selected.vehicle_id), {
        shouldValidate: true,
        shouldDirty: true,
      });
      lastAppliedDriverId.current = selectedDriverId;
    }
  }, [selectedDriverId, drivers, setValue]);

  const scrollAndFocus = useCallback(
    (errs: FieldErrors<WaybillFormValues>) => {
      const firstKey = Object.keys(errs)[0] as keyof WaybillFormValues;
      if (firstKey) {
        setTimeout(() => setFocus(firstKey), 150);
      }
    },
    [setFocus],
  );

  const onInvalid: SubmitErrorHandler<WaybillFormValues> = useCallback(
    (errs) => {
      setSubmitAttempted(true);
      scrollAndFocus(errs);
    },
    [scrollAndFocus],
  );

  const resetPickerState = useCallback(() => {
    [sender, receiver, driver, vehicle, origin, destination].forEach((p) => {
      p.setSearch("");
    });
    lastAppliedDriverId.current = null;
  }, [sender, receiver, driver, vehicle, origin, destination]);

  const onSubmit: SubmitHandler<WaybillFormValues> = useCallback(
    async (data) => {
      setSubmitAttempted(false);
      try {
        const payload = {
          waybill_number: data.waybill_number || undefined,
          issue_date: data.issue_date || undefined,
          dispatch_date: data.dispatch_date || undefined,
          actual_delivery_date: data.actual_delivery_date || undefined,
          status: data.status || undefined,
          sender_id: Number(data.sender_id),
          receiver_id: Number(data.receiver_id),
          driver_id: Number(data.driver_id),
          vehicle_id: Number(data.vehicle_id),
          origin_location_id: Number(data.origin_location_id),
          destination_location_id: Number(data.destination_location_id),
          total_weight: data.total_weight
            ? parseFloat(data.total_weight)
            : undefined,
          total_packages: data.total_packages
            ? parseInt(data.total_packages)
            : undefined,
          description: data.description || undefined,
          freight_charge: data.freight_charge
            ? parseFloat(data.freight_charge)
            : undefined,
          have_insurance: data.have_insurance,
          // FinancialSection now clears insurance_amount whenever have_insurance
          // is false, so this no longer needs a manual ": 0" fallback.
          insurance_amount: data.insurance_amount
            ? parseFloat(data.insurance_amount)
            : undefined,
          other_charges: data.other_charges
            ? parseFloat(data.other_charges)
            : undefined,
          payment_status: data.payment_status || undefined,
          notes: data.notes || undefined,
        };

        if (mode === "create") {
          await createWaybill.mutateAsync(payload);
          toast.success("بارنامه با موفقیت ایجاد شد");
          reset();
          resetPickerState();
        } else if (waybill?.id) {
          await updateWaybill.mutateAsync({
            data: payload,
            waybillId: waybill.id,
          });
          toast.success("بارنامه با موفقیت ویرایش شد");
        }

        onSuccess?.();
      } catch (err: any) {
        const message = err?.message || "خطا در ثبت بارنامه";
        toast.error(message);
      }
    },
    [
      mode,
      waybill?.id,
      createWaybill,
      updateWaybill,
      reset,
      resetPickerState,
      onSuccess,
    ],
  );

  const isPending =
    createWaybill.isPending || updateWaybill.isPending || isSubmitting;

  const errorNames = Object.keys(errors);
  const errorCount = errorNames.length;

  useEffect(() => {
    if (submitAttempted && errorCount === 0) {
      setSubmitAttempted(false);
    }
  }, [errors, submitAttempted, errorCount]);

  const selectedDriver = toItems<DriverResponse>(drivers).find(
    (d) => d.id === Number(selectedDriverId),
  );
  const isVehicleFixed = !!selectedDriver?.vehicle_id;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          {submitAttempted && errorCount > 0 && (
            <Alert
              variant="destructive"
              className="animate-in slide-in-from-top-2"
            >
              <AlertDescription className="space-y-1">
                <p>{errorCount} مورد نیاز به اصلاح دارد:</p>
                <ul className="list-disc pr-5 text-sm" dir="rtl">
                  {errorNames.slice(0, 4).map((key) => (
                    <li key={key}>{fieldLabels[key] || key}</li>
                  ))}
                  {errorCount > 4 && <li>و {errorCount - 4} مورد دیگر...</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <BasicInfoSection control={control} errors={errors} />

          <EntitiesSection
            control={control}
            errors={errors}
            sender={{ ...sender, data: senders, loading: sendersLoading }}
            receiver={{
              ...receiver,
              data: receivers,
              loading: receiversLoading,
            }}
            driver={{ ...driver, data: drivers, loading: driversLoading }}
            vehicle={{ ...vehicle, data: vehicles, loading: vehiclesLoading }}
            origin={{
              ...origin,
              data: originLocations,
              loading: originLoading,
            }}
            destination={{
              ...destination,
              data: destLocations,
              loading: destLoading,
            }}
            isVehicleFixed={isVehicleFixed}
          />

          <CargoSection control={control} errors={errors} />
          <FinancialSection
            control={control}
            errors={errors}
            haveInsurance={haveInsurance}
          />

          <Separator />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="ml-2" />
                در حال ذخیره...
              </>
            ) : mode === "create" ? (
              "ثبت بارنامه"
            ) : (
              "به‌روزرسانی بارنامه"
            )}
          </Button>
        </form>
      </Form>

      <CreateCustomerModal
        open={sender.modalOpen}
        onOpenChange={sender.setModalOpen}
        shouldNavigate={false}
      />
      <CreateCustomerModal
        open={receiver.modalOpen}
        onOpenChange={receiver.setModalOpen}
        shouldNavigate={false}
      />
      <CreateDriverModal
        open={driver.modalOpen}
        onOpenChange={driver.setModalOpen}
        shouldNavigate={false}
      />
      <CreateVehicleModal
        open={vehicle.modalOpen}
        onOpenChange={vehicle.setModalOpen}
        shouldNavigate={false}
      />
      <CreateLocationModal
        open={origin.modalOpen}
        onOpenChange={origin.setModalOpen}
        shouldNavigate={false}
      />
      <CreateLocationModal
        open={destination.modalOpen}
        onOpenChange={destination.setModalOpen}
        shouldNavigate={false}
      />
    </>
  );
}
