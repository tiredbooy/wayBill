import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLocation, useUpdateLocation } from "@/_libs/services/queries/locations.queries";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormCheckbox } from "../reusable/form-inputs/FormCheckbox";
import type { LocationDetail } from "@/_libs/types/location-types";

interface Props {
  mode?: "create" | "edit";
  location?: LocationDetail;
  onSuccess?: () => void;
  shouldNavigate?: boolean
}

const schema = z.object({
  name: z.string().min(2, "نام موقعیت الزامی است"),
  province: z.string().min(2, "استان الزامی است"),
  is_terminal: z.boolean().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LocationForm({ mode = "create", location, onSuccess, shouldNavigate }: Props) {
  const create = useCreateLocation(shouldNavigate);
  const update = useUpdateLocation(shouldNavigate);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: location?.name ?? "",
      province: location?.province ?? "",
      is_terminal: location?.is_terminal ?? false,
      address: location?.address ?? "",
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;
  const isPending = create.isPending || update.isPending || isSubmitting;

  const onSubmit = async (data: FormValues) => {
    if (mode === "create") {
      await create.mutateAsync(data);
      reset();
    } else if (location?.id) {
      await update.mutateAsync({ data, locationId: location.id });
    }
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={control} name="name" label="نام موقعیت" />
        <FormInput control={control} name="province" label="استان" />
        <FormCheckbox control={control} name="is_terminal" label="پایانه است؟" />
        <FormInput control={control} name="address" label="آدرس" />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : mode === "create" ? "ایجاد موقعیت" : "ویرایش موقعیت"}
        </Button>
      </form>
    </Form>
  );
}