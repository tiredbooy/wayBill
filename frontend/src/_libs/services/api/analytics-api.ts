import type { AnalyticsSummary } from "@/features/dashboard/DashboardContent";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export const PERIODS = [
  { label: "۷ روز گذشته", value: "7d" },
  { label: "۳۰ روز گذشته", value: "30d" },
  { label: "این ماه", value: "this_month" },
  { label: "ماه گذشته", value: "last_month" },
  { label: "همه زمان‌ها", value: "all" },
];

export async function getAnalyticsSummary(
  period: string,
): Promise<AnalyticsSummary> {
  const url = withQuery(`${API_URL}/api/v1/analytics`, { period });
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("خطا در دریافت آمار");
  return await res.json();
}
