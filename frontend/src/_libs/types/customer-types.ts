export interface CustomerBase {
  name: string;
  national_id: string;
  economic_code?: string;
  phone_mobile?: string | null;
  phone_fixed?: string | null;
  address?: string;
  postal_code?: string | null;
  city?: string | null;
  province?: string | null;
  email?: string | null;
  notes?: string;
}

export type CreateCustomerReq = CustomerBase;
export type UpdateCustomerReq = Partial<CustomerBase>;

export interface CustomerDetail extends CustomerBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerParams {
  page?: number;
  limit?: number;
  q?: string; 
  sortBy?: string;
  orderBy?: string;
}