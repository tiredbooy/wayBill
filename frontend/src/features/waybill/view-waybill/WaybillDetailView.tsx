import type { WaybillDetail } from "@/_libs/types/waybill-types";
import {
  convertToPersianDigits,
  formatRial,
  translatePaymentStatus,
  translateWaybillStatus,
} from "@/_libs/utils/helper";

interface Props {
  waybill: WaybillDetail;
}

export function WaybillDetailView({ waybill }: Props) {
  const infoRows = [
    { label: "شماره بارنامه", value: waybill.waybill_number },
    { label: "تاریخ صدور", value: new Date(waybill.issue_date).toLocaleDateString("fa-IR") },
    { label: "تاریخ بارگیری", value: new Date(waybill.dispatch_date).toLocaleDateString("fa-IR") },
    // { label: "تاریخ تحویل پیش‌بینی شده", value: waybill.expected_delivery_date ? new Date(waybill.expected_delivery_date).toLocaleDateString("fa-IR") : "—" },
    { label: "تاریخ تحویل", value: waybill.actual_delivery_date ? new Date(waybill.actual_delivery_date).toLocaleDateString("fa-IR") : "—" },
    { label: "وضعیت", value: translateWaybillStatus(waybill.status) },
    { label: "فرستنده", value: `${waybill.sender}` },
    { label: "گیرنده", value: `${waybill.receiver}` },
    { label: "راننده", value: `${waybill.driver}` },
    { label: "وسیله نقلیه", value: `${waybill.vehicle}` },
    { label: "مبدا", value: `${waybill.origin_location}` },
    { label: "مقصد", value: `${waybill.destination_location}` },
    { label: "وزن کل (کیلوگرم)", value: convertToPersianDigits(waybill.total_weight) },
    { label: "تعداد بسته‌ها", value: convertToPersianDigits(waybill.total_packages) },
    { label: "شرح", value: waybill.description || "—" },
    { label: "کرایه حمل", value: formatRial(waybill.freight_charge) },
    { label: "بیمه", value: waybill.have_insurance ? "دارد" : "ندارد" },
    { label: "مبلغ بیمه", value: formatRial(waybill.insurance_amount) },
    { label: "سایر هزینه‌ها", value: formatRial(waybill.other_charges) },
    { label: "مبلغ کل", value: formatRial(waybill.total_amount) },
    { label: "وضعیت پرداخت", value: translatePaymentStatus(waybill.payment_status) },
    { label: "یادداشت", value: waybill.notes || "—" },
    { label: "تاریخ ثبت", value: new Date(waybill.created_at).toLocaleDateString("fa-IR") },
    { label: "آخرین بروزرسانی", value: new Date(waybill.updated_at).toLocaleDateString("fa-IR") },
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
