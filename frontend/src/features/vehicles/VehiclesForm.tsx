import {
  useCreateVehicle,
  useUpdateVehicle,
} from "@/_libs/services/queries/vehicles.queries";
import type {
  CreateVehicleReq,
  UpdateVehicleReq,
  VehicleResponse,
} from "@/_libs/types/vehicle-types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { FormCommandSelect } from "../reusable/form-inputs/CommandSelect";
import { FormJalaliDatePicker } from "../reusable/form-inputs/FormDatePicker";
import { FormInput } from "../reusable/form-inputs/FormInput";

interface Props {
  mode?: "edit" | "create";
  vehicle?: VehicleResponse;
}

const vehicleSchema = z.object({
  plate: z.string().min(2, "شماره پلاک الزامی است"),
  model: z.string().min(2, "مدل ماشین الزامی است"),
  year: z.string().optional(),
  capacity: z.string().optional(),
  color: z.string().optional(),
  status: z.string().optional(),
  insurance_expiry: z.string().min(2, "تاریخ انقظای بیمه الزامی است"),
  notes: z.string().optional(),
});

type VehicleFormValues = z.Infer<typeof vehicleSchema>;

export default function VehiclesForm({ mode = "create", vehicle }: Props) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: vehicle?.plate ?? "",
      model: vehicle?.model ?? "",
      year: vehicle?.year ?? "",
      capacity: vehicle?.capacity ?? "",
      color: vehicle?.color ?? "",
      status: vehicle?.status ?? "active",
      insurance_expiry: vehicle?.insurance_expiry ?? "",
      notes: vehicle?.notes ?? "",
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = form;

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const navigate = useNavigate();

  const onSubmit = async (data: VehicleFormValues) => {
    if (mode === "create") {
      createVehicle.mutateAsync(data as CreateVehicleReq);
      reset();
    } else if (mode === "edit") {
      const req = {
        data: data as UpdateVehicleReq,
        vehicleID: Number(vehicle?.id),
      };

      updateVehicle.mutateAsync(req);
    }

    navigate("/dashboard/vehicles");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormInput
          control={control}
          name="plate"
          label="پلاک"
          error={errors.plate?.message}
        />
        <FormInput
          control={control}
          name="model"
          label="مدل"
          error={errors.model?.message}
        />
        <FormInput
          control={control}
          name="year"
          label="سال"
          error={errors.year?.message}
        />
        <FormInput
          control={control}
          name="capacity"
          label="ظرفیت"
          error={errors.capacity?.message}
        />
        <FormInput
          control={control}
          name="color"
          label="رنگ"
          error={errors.color?.message}
        />
        <FormInput
          control={control}
          name="notes"
          label="نوت"
          error={errors.notes?.message}
        />

        <FormCommandSelect
          control={control}
          name="status"
          label="وضعیت"
          options={[
            { label: "فعال", value: "active" },
            { label: "غیرفعال", value: "inactive" },
          ]}
        />

        <FormJalaliDatePicker
          outputType="iso"
          control={control}
          name="insurance_expiry"
          label="انقظای بیمه"
        />

        <div className="col-span-full">
          <Button
            type="submit"
            disabled={
              isSubmitting || createVehicle.isPending || updateVehicle.isPending
            }
            className="w-full"
          >
            {isSubmitting ||
            createVehicle.isPending ||
            updateVehicle.isPending ? (
              <Spinner />
            ) : (
              " ساخت وسیله"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
