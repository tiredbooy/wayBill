export interface CustomerStat {
  name: string;
  count: number;
}

export interface AnalyticsSummary {
  total_waybills: number;
  active_waybills: number;
  delivered_waybills: number;
  total_freight: number;
  total_other_charges: number;
  total_insurance: number;
  total_amount: number;
  average_freight: number;
  commission_rate: number;
  revenue: number;
  top_senders?: CustomerStat[];
  top_receivers?: CustomerStat[];
}
