import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormJalaliDatePicker } from "@/features/reusable/form-inputs/FormDatePicker";
import type { SectionProps } from "./schema";

export function BasicInfoSection({ control, errors }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>اطلاعات پایه</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="waybill_number"
          label="شماره بارنامه"
          placeholder="شماره بارنامه"
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
          label="تاریخ تحویل واقعی"
        />
        <FormInput
          control={control}
          name="status"
          label="وضعیت"
          placeholder="در انتظار، در مسیر، تحویل شده..."
          error={errors.status?.message}
        />
      </CardContent>
    </Card>
  );
}
