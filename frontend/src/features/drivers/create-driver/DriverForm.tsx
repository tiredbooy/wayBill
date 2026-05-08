import {
  useCreateDriver,
  useUpdateDriver,
} from "@/_libs/services/queries/drivers.queries";
import { useVehicles } from "@/_libs/services/queries/vehicles.queries";
import type {
  CreateDriverReq,
  DriverDetail,
  UpdateDriverReq,
} from "@/_libs/types/driver-types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormCommandSelect } from "@/features/reusable/form-inputs/CommandSelect";
import { FormJalaliDatePicker } from "@/features/reusable/form-inputs/FormDatePicker";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import CreateVehicleModal from "@/features/vehicles/CreateVehicleModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  mode: "edit" | "create";
  driver?: DriverDetail;
}

const driverSchema = z.object({
  first_name: z.string().min(2, "نام الزامی است"),
  last_name: z.string().min(2, "نام خانوادگی الزامی است"),
  phone: z.string().min(10, "شماره معتبر نیست"),
  vehicle_id: z.number(),
  code: z.string().optional(),
  address: z.string().optional(),
  national_code: z.string(),
  email: z.string().optional(),
  license_number: z.string(),
  license_expiry: z.string().min(1, "تاریخ انقضای گواهینامه الزامی است"),
  birth_date: z.string().min(1, "تاریخ تولد الزامی است"),
});

type DriverFormValues = z.infer<typeof driverSchema>;

export function DriverForm({ mode = "create", driver }: Props) {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      first_name: driver?.first_name ?? "",
      last_name: driver?.last_name ?? "",
      phone: driver?.phone ?? "",
      vehicle_id: driver?.vehicle_id ?? 0,
      code: driver?.code ?? "",
      address: driver?.address ?? "",
      national_code: driver?.national_code ?? "",
      email: driver?.email ?? "",
      license_number: driver?.license_number ?? "",
      license_expiry: driver?.license_expiry ?? "",
      birth_date: driver?.birth_date ?? "",
    },
  });

  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const { data, isLoading } = useVehicles({
    q: vehicleSearch ?? "",
  });
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = form;

  const modifiedVehicleData =
    data?.results?.map((v) => {
      return {
        label: v.model,
        value: String(v.id),
      };
    }) ?? [];

  const onSubmit = async (data: DriverFormValues) => {
    console.log("MODE: ", mode);
    if (mode === "create") {
      createDriver.mutateAsync(data as CreateDriverReq);
      reset();
    } else if (mode === "edit") {
      const req = {
        data: data as UpdateDriverReq,
        driverID: Number(driver?.id),
      };
      updateDriver.mutateAsync(req);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormInput
            control={control}
            name="first_name"
            label="نام"
            error={errors.first_name?.message}
          />
          <FormInput
            control={control}
            name="last_name"
            label="نام خانوادگی"
            error={errors.last_name?.message}
          />
          <FormInput
            control={control}
            name="phone"
            label="شماره تماس"
            error={errors.phone?.message}
          />
          <FormInput
            control={control}
            name="national_code"
            label="کد ملی"
            error={errors.national_code?.message}
          />
          <FormInput
            control={control}
            name="email"
            label="ایمیل"
            type="email"
            error={errors.email?.message}
          />
          <FormInput
            control={control}
            name="license_number"
            label="شماره گواهینامه"
            error={errors.license_number?.message}
          />
          <FormInput
            control={control}
            name="code"
            label="کد راننده"
            error={errors.code?.message}
          />
          <FormInput
            control={control}
            name="address"
            label="آدرس"
            error={errors.address?.message}
          />

          <FormCommandSelect
            control={control}
            searchValue={vehicleSearch}
            onSearchChange={setVehicleSearch}
            name="vehicle_id"
            label="وسیله نقلیه"
            options={modifiedVehicleData}
            onAddNew={() =>
              isLoading ? null : setVehicleOpen((isOpen) => !isOpen)
            }
          />

          <FormJalaliDatePicker
            outputType="iso"
            control={control}
            name="birth_date"
            label="تاریخ تولد"
          />
          <FormJalaliDatePicker
            outputType="iso"
            control={control}
            name="license_expiry"
            label="انقضای گواهینامه"
          />

          <div className="col-span-full">
            <Button
              type="submit"
              className="w-full"
              disabled={createDriver.isPending || isLoading || isSubmitting}
            >
              {createDriver.isPending ||
              updateDriver.isPending ||
              isSubmitting ? (
                <Spinner />
              ) : (
                " ثبت راننده"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <CreateVehicleModal open={vehicleOpen} />
    </>
  );
}
