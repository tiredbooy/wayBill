export interface LocationBase {
  name: string;
  province: string;
  is_terminal?: boolean;
  address?: string | null;
}

export type CreateLocationReq = LocationBase;
export type UpdateLocationReq = Partial<LocationBase>;

export interface LocationDetail extends LocationBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface LocationParams {
  page?: number;
  limit?: number;
  q?: string;
  province?: string;
  is_terminal?: boolean;
}