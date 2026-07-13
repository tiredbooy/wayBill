import { useEffect } from "react";
import {
  useFormContext,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormCheckbox } from "@/features/reusable/form-inputs/FormCheckbox";
import { FormNativeSelect } from "@/features/reusable/form-inputs/FormNativeSelect";
import type { WaybillFormValues } from "./schema";

interface FinancialSectionProps {
  control: Control<WaybillFormValues>;
  errors: FieldErrors<WaybillFormValues>;
  haveInsurance: boolean;
}

const paymentStatusOptions = [
  { value: "unpaid", label: "پرداخت نشده" },
  { value: "partial", label: "پرداخت جزئی" },
  { value: "paid", label: "پرداخت شده" },
  { value: "refunded", label: "بازگشت وجه" },
];

export function FinancialSection({
  control,
  errors,
  haveInsurance,
}: FinancialSectionProps) {
  const { setValue } = useFormContext<WaybillFormValues>();

  useEffect(() => {
    if (!haveInsurance) {
      setValue("insurance_amount", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [haveInsurance, setValue]);

  return (
    <Card className="overflow-hidden border-border/70">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle>اطلاعات مالی</CardTitle>
        <CardDescription>
          همه مبالغ را به ریال وارد کنید؛ مبلغ کل خودکار محاسبه می‌شود
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FormInput
          control={control}
          name="freight_charge"
          label="کرایه حمل (ریال)"
          type="number"
          step="1"
          placeholder="0"
          error={errors.freight_charge?.message}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            control={control}
            name="have_insurance"
            label="دارای بیمه‌نامه"
          />
        </div>

        {haveInsurance && (
          <FormInput
            control={control}
            name="insurance_amount"
            label="مبلغ بیمه (ریال)"
            type="number"
            step="1"
            placeholder="0"
            error={errors.insurance_amount?.message}
          />
        )}

        <FormInput
          control={control}
          name="other_charges"
          label="سایر هزینه‌ها (ریال)"
          type="number"
          step="1"
          placeholder="0"
          error={errors.other_charges?.message}
        />
        <FormNativeSelect
          control={control}
          name="payment_status"
          label="وضعیت پرداخت"
          options={paymentStatusOptions}
          error={errors.payment_status?.message}
        />
        <FormInput
          control={control}
          name="notes"
          label="یادداشت‌ها"
          className="md:col-span-2 xl:col-span-3"
          multiline
          rows={3}
          placeholder="توافق‌های مالی یا توضیحات تکمیلی"
          error={errors.notes?.message}
        />
      </CardContent>
    </Card>
  );
}
