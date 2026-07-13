import { z } from "zod";
import type { Control, FieldErrors } from "react-hook-form";
import type { CustomerDetail } from "@/_libs/types/customer-types";
import type { DriverResponse } from "@/_libs/types/driver-types";
import type { VehicleResponse } from "@/_libs/types/vehicle-types";
import type { LocationDetail } from "@/_libs/types/location-types";

const numericString = (label: string) =>
  z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), {
      message: `${label} باید عددی معتبر و مثبت باشد`,
    });

export const waybillSchema = z.object({
  waybill_number: z.string().optional(),
  issue_date: z.string().min(1, "تاریخ صدور الزامی است"),
  dispatch_date: z.string().min(1, "تاریخ بارگیری الزامی است"),
  actual_delivery_date: z.string().optional(),
  status: z.string().optional(),
  sender_id: z.string().min(1, "فرستنده الزامی است"),
  receiver_id: z.string().min(1, "گیرنده الزامی است"),
  driver_id: z.string().min(1, "راننده الزامی است"),
  vehicle_id: z.string().min(1, "وسیله نقلیه الزامی است"),
  origin_location_id: z.string().min(1, "مبدا الزامی است"),
  destination_location_id: z.string().min(1, "مقصد الزامی است"),
  total_weight: numericString("وزن کل"),
  total_packages: numericString("تعداد بسته"),
  description: z.string().optional(),
  freight_charge: numericString("کرایه حمل"),
  have_insurance: z.boolean(),
  insurance_amount: numericString("مبلغ بیمه"),
  other_charges: numericString("سایر هزینه‌ها"),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.sender_id && data.sender_id === data.receiver_id) {
    ctx.addIssue({
      code: "custom",
      path: ["receiver_id"],
      message: "فرستنده و گیرنده نمی‌توانند یکسان باشند",
    });
  }
  if (
    data.origin_location_id &&
    data.origin_location_id === data.destination_location_id
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["destination_location_id"],
      message: "مبدا و مقصد نمی‌توانند یکسان باشند",
    });
  }
  if (
    data.issue_date &&
    data.dispatch_date &&
    new Date(data.dispatch_date) < new Date(data.issue_date)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["dispatch_date"],
      message: "تاریخ بارگیری نمی‌تواند قبل از تاریخ صدور باشد",
    });
  }
  if (
    data.dispatch_date &&
    data.actual_delivery_date &&
    new Date(data.actual_delivery_date) < new Date(data.dispatch_date)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["actual_delivery_date"],
      message: "تاریخ تحویل نمی‌تواند قبل از تاریخ بارگیری باشد",
    });
  }
});

export type WaybillFormValues = z.input<typeof waybillSchema>;

export const mapCustomerOptions = (data: CustomerDetail[] = []) =>
  data.map((c) => ({ label: c.name, value: String(c.id) }));

export const mapDriverOptions = (data: DriverResponse[] = []) =>
  data.map((d) => ({
    label: `${d.first_name} ${d.last_name}`,
    value: String(d.id),
  }));

export const mapVehicleOptions = (data: VehicleResponse[] = []) =>
  data.map((v) => ({ label: v.model, value: String(v.id) }));

export const mapLocationOptions = (data: LocationDetail[] = []) =>
  data.map((l) => ({ label: l.name, value: String(l.id) }));

export interface SectionProps {
  control: Control<WaybillFormValues>;
  errors: FieldErrors<WaybillFormValues>;
}
