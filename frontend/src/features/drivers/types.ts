export interface Driver {
  id: number;
  name: string;
  phone: string;
  national_code: string;
  license_number: string;
  vehicle: string;
  birth_date?: string;
  total_trips: number;
  hired_at: string;
}
