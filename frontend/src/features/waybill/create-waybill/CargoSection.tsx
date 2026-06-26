import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/features/reusable/form-inputs/FormInput";
import type { SectionProps } from "./schema";

export function CargoSection({ control, errors }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>جزئیات محموله</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="total_weight"
          label="وزن کل (کیلوگرم)"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.total_weight?.message}
        />
        <FormInput
          control={control}
          name="total_packages"
          label="تعداد بسته"
          type="number"
          placeholder="0"
          error={errors.total_packages?.message}
        />
        <FormInput
          control={control}
          name="description"
          label="شرح محموله"
          className="md:col-span-2"
          error={errors.description?.message}
        />
      </CardContent>
    </Card>
  );
}
