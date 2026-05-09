import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/_libs/services/queries/customer.queries";
import type {
  CreateCustomerReq,
  CustomerDetail,
  UpdateCustomerReq,
} from "@/_libs/types/customer-types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  mode: "edit" | "create";
  customer?: CustomerDetail;
  onSuccess?: () => void;
  shouldNavigate?: boolean;
}

const customerSchema = z.object({
  name: z.string().min(2, "نام مشتری الزامی است"),
  national_id: z.string().min(10, "کد ملی/شناسه ملی معتبر نیست"),
  economic_code: z.string().optional(),
  phone_mobile: z.string().optional(),
  phone_fixed: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  email: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerForm({
  mode = "create",
  customer,
  onSuccess,
  shouldNavigate,
}: Props) {
  const createCustomer = useCreateCustomer(shouldNavigate);
  const updateCustomer = useUpdateCustomer(shouldNavigate);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? "",
      national_id: customer?.national_id ?? "",
      economic_code: customer?.economic_code ?? "",
      phone_mobile: customer?.phone_mobile ?? "",
      phone_fixed: customer?.phone_fixed ?? "",
      address: customer?.address ?? "",
      postal_code: customer?.postal_code ?? "",
      city: customer?.city ?? "",
      province: customer?.province ?? "",
      email: customer?.email ?? "",
      notes: customer?.notes ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: CustomerFormValues) => {
    if (mode === "create") {
      await createCustomer.mutateAsync(data as CreateCustomerReq);
      reset();
      onSuccess?.();
    } else if (mode === "edit" && customer?.id) {
      await updateCustomer.mutateAsync({
        data: data as UpdateCustomerReq,
        customerId: customer.id,
      });
      onSuccess?.();
    }
  };

  const isPending =
    createCustomer.isPending || updateCustomer.isPending || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="name"
            label="نام مشتری"
            error={errors.name?.message}
          />
          <FormInput
            control={control}
            name="national_id"
            label="کد ملی / شناسه ملی"
            error={errors.national_id?.message}
          />
          <FormInput
            control={control}
            name="economic_code"
            label="کد اقتصادی"
            error={errors.economic_code?.message}
          />
          <FormInput
            control={control}
            name="phone_mobile"
            label="تلفن همراه"
            error={errors.phone_mobile?.message}
          />
          <FormInput
            control={control}
            name="phone_fixed"
            label="تلفن ثابت"
            error={errors.phone_fixed?.message}
          />
          <FormInput
            control={control}
            name="postal_code"
            label="کد پستی"
            error={errors.postal_code?.message}
          />
          <FormInput
            control={control}
            name="city"
            label="شهر"
            error={errors.city?.message}
          />
          <FormInput
            control={control}
            name="province"
            label="استان"
            error={errors.province?.message}
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
            name="address"
            label="آدرس"
            error={errors.address?.message}
          />
          <FormInput
            control={control}
            name="notes"
            label="یادداشت"
            error={errors.notes?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Spinner />
          ) : mode === "create" ? (
            "ثبت مشتری"
          ) : (
            "ویرایش مشتری"
          )}
        </Button>
      </form>
    </Form>
  );
}
