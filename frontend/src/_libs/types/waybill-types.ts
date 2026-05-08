export interface WaybillResponse {
  id: number;
  waybill_number: string;
  status: string | null;
  total_weight: number;
  have_insurance: boolean;
  total_amount: number | null;
  payment_status: string | null;
  sender_name: string;
  receiver_name: string;
  driver_name: string;
  origin_location: string;
  destination_location: string;
  created_at: string;
  updated_at: string;
}

export interface WaybillDetail {
  id: number;
  waybill_number: string;
  issue_date: string;
  dispatch_date: string;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  status: string | null;
  sender: string;
  sender_id: number;
  sender_phone_mobile: string;
  sender_phone_fixed: string;
  receiver: string;
  receiver_id: number;
  receiver_phone_mobile: string;
  receiver_phone_fixed: string;
  driver: string;
  driver_id: number;
  driver_phone_num?: string;
  driver_license_num?: string;
  driver_national_code?: string;
  vehicle: string;
  vehicle_id: number;
  vehicle_plate: string;
  origin_location: string;
  origin_location_id: number;
  destination_location: string;
  destination_location_id: number;
  total_weight: number;
  total_packages: number;
  description: string | null;
  freight_charge: number;
  have_insurance: boolean;
  insurance_amount: number;
  other_charges: number | null;
  total_amount: number | null;
  payment_status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateWaybillReq = {
  waybill_number?: string | null;
  issue_date?: string;
  dispatch_date?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  status?: string;
  sender_id: number;
  receiver_id: number;
  driver_id: number;
  vehicle_id: number;
  origin_location_id: number;
  destination_location_id: number;
  total_weight?: number;
  total_packages?: number;
  description?: string;
  freight_charge?: number;
  have_insurance?: boolean;
  insurance_amount?: number;
  other_charges?: number;
  payment_status?: string;
  notes?: string;
};

export type UpdateWaybillReq = Partial<
  Omit<
    CreateWaybillReq,
    | "sender_id"
    | "receiver_id"
    | "driver_id"
    | "vehicle_id"
    | "origin_location_id"
    | "destination_location_id"
  >
> & {
  sender_id?: number;
  receiver_id?: number;
  driver_id?: number;
  vehicle_id?: number;
  origin_location_id?: number;
  destination_location_id?: number;
};

export interface WaybillParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  sortBy?: string;
  orderBy?: string;
}
