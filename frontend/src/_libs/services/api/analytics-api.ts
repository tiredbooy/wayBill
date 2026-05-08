import type { AnalyticsSummary } from "@/features/dashboard/DashboardContent";
import { withQuery } from "@/_libs/utils/query-helpers";
import { getToken } from "@/_libs/auth/auth";

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
  const token = await getToken();
  const url = withQuery(`${API_URL}/api/v1/analytics`, { period });
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });
  if (!res.ok) throw new Error("خطا در دریافت آمار");
  return await res.json();
}
