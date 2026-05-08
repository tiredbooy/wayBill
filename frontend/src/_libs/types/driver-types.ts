export interface UpdateDriverReq {
  first_name?: string;
  last_name?: string;
  phone?: string;
  vehicle_id?: number;
  code?: string;
  address?: string;
  national_code?: string;
  email?: string;
  license_number?: string;
  license_expiry?: string;
  hire_date?: string;
  birth_date?: string;
  status?: "active" | "inactive";
}

export interface CreateDriverReq {
  first_name: string;
  last_name: string;
  phone?: string;
  vehicle_id: number;
  code?: string;
  address?: string;
  national_code: string;
  email?: string;
  license_number?: string;
  license_expiry?: string;
  hire_date?: string;
  birth_date?: string;
  status?: "active" | "inactive";
}

export interface DriverResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  vehicle_id: number;
  code: string;
  national_code: string;
  email: string;
  status: string;
  total_waybills?: number;
  license_expiry: string;
  hire_date: string;
  created_at: string;
}

export interface DriverDetail extends DriverResponse {
  address?: string;
  license_number?: string;
  birth_date?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  updated_at?: string;
}

export interface DriverParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  sortBy?: string;
  orderBy?: string;
}
