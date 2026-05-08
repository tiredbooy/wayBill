export interface UpdateVehicleReq {
  plate?: string;
  model?: string;
  year?: string;
  capacity?: string;
  color?: string;
  insurance_expiry?: string;
  status?: "active" | "inactive";
  notes?: string;
}

export interface CreateVehicleReq {
  plate: string;
  model: string;
  year?: string;
  capacity?: string;
  color?: string;
  insurance_expiry?: string;
  status?: "active" | "inactive";
  notes?: string;
}

export interface VehicleResponse {
  id: number;
  plate: string;
  model: string;
  year: string;
  capacity: string;
  driver?: string;
  color: string;
  insurance_expiry: string;
  status: "active" | "inactive";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  orderBy?: string;
}
