import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import { FormJalaliDatePicker } from "@/features/reusable/form-inputs/FormDatePicker";
import { FormNativeSelect } from "@/features/reusable/form-inputs/FormNativeSelect";
import type { SectionProps } from "./schema";

const statusOptions = [
  { value: "created", label: "ایجاد شده" },
  { value: "pending", label: "در انتظار" },
  { value: "in_transit", label: "در مسیر" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export function BasicInfoSection({ control, errors }: SectionProps) {
  return (
    <Card className="overflow-hidden border-border/70">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle>اطلاعات پایه</CardTitle>
        <CardDescription>
          شماره، تاریخ‌های عملیاتی و وضعیت فعلی بارنامه
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        <FormNativeSelect
          control={control}
          name="status"
          label="وضعیت"
          options={statusOptions}
          error={errors.status?.message}
        />
      </CardContent>
    </Card>
  );
}
