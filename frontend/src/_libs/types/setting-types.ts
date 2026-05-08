export interface Setting {
  company_name: string;
  address: string;
  contact: ContactInfo;
  commission_rate: number;
  preferred_theme: "light" | "dark" | "system";
  updated_at: string;
}

export interface ContactInfo {
  mobiles: string[];
  fixed: string;
  email: string;
  website: string;
}

export interface SettingInput {
  company_name?: string;
  address?: string;
  contact?: ContactInfo;
  commission_rate?: number;
  preferred_theme?: string;
}
