import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormCheckbox } from "@/features/reusable/form-inputs/FormCheckbox";
import type { WaybillFormValues } from "./schema";

interface FinancialSectionProps {
  control: any;
  errors: any;
  haveInsurance: boolean;
}

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
    <Card>
      <CardHeader>
        <CardTitle>اطلاعات مالی</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="freight_charge"
          label="کرایه حمل"
          type="number"
          step="0.01"
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
            label="مبلغ بیمه"
            type="number"
            step="0.01"
            placeholder="0"
            error={errors.insurance_amount?.message}
          />
        )}

        <FormInput
          control={control}
          name="other_charges"
          label="سایر هزینه‌ها"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.other_charges?.message}
        />
        <FormInput
          control={control}
          name="payment_status"
          label="وضعیت پرداخت"
          placeholder="پرداخت شده / پرداخت نشده"
          error={errors.payment_status?.message}
        />
        <FormInput
          control={control}
          name="notes"
          label="یادداشت‌ها"
          className="md:col-span-2"
          error={errors.notes?.message}
        />
      </CardContent>
    </Card>
  );
}
