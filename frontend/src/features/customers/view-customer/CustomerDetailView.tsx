import type { CustomerDetail } from "@/_libs/types/customer-types";
import { convertToPersianDigits } from "@/_libs/utils/helper";

interface Props {
  customer: CustomerDetail;
}

export function CustomerDetailView({ customer }: Props) {
  const infoRows = [
    { label: "نام مشتری", value: customer.name },
    { label: "کد ملی / شناسه ملی", value: convertToPersianDigits(customer?.national_id) },
    { label: "کد اقتصادی", value: convertToPersianDigits(String(customer?.economic_code)) },
    { label: "تلفن همراه", value: convertToPersianDigits(String(customer?.phone_mobile)) },
    { label: "تلفن ثابت", value: convertToPersianDigits(String(customer?.phone_fixed)) },
    { label: "ایمیل", value: customer.email },
    { label: "آدرس", value: customer.address },
    { label: "کد پستی", value: convertToPersianDigits(String(customer?.postal_code)) },
    { label: "شهر", value: customer.city },
    { label: "استان", value: customer.province },
    { label: "یادداشت", value: customer.notes },
    { label: "تاریخ ثبت", value: new Date(customer.created_at).toLocaleDateString("fa-IR") },
    { label: "آخرین بروزرسانی", value: new Date(customer.updated_at).toLocaleDateString("fa-IR") },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {infoRows.map((row) => (
        <div key={row.label} className="border-b pb-2">
          <div className="text-sm text-muted-foreground">{row.label}</div>
          <div className="font-medium break-words">{row.value || "—"}</div>
        </div>
      ))}
    </div>
  );
}