import type { LocationDetail } from "@/_libs/types/location-types";
import { convertToPersianDigits } from "@/_libs/utils/helper";

interface Props {
  location: LocationDetail;
}

export function LocationDetailView({ location }: Props) {
  const infoRows = [
    { label: "شناسه", value: convertToPersianDigits(location.id) },
    { label: "نام موقعیت", value: location.name },
    { label: "استان", value: location.province },
    { label: "پایانه", value: location.is_terminal ? "بله" : "خیر" },
    { label: "آدرس", value: location.address || "—" },
    {
      label: "تاریخ ثبت",
      value: new Date(location.created_at).toLocaleDateString("fa-IR"),
    },
    {
      label: "آخرین بروزرسانی",
      value: new Date(location.updated_at).toLocaleDateString("fa-IR"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {infoRows.map((row) => (
        <div key={row.label} className="border-b pb-2">
          <div className="text-sm text-muted-foreground">{row.label}</div>
          <div className="font-medium break-words">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
