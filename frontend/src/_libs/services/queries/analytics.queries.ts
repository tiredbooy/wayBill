import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api/analytics-api";
import type { AnalyticsSummary } from "@/features/dashboard/DashboardContent";

export function useAnalyticsSummary(period: string) {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics", period],
    queryFn: () => getAnalyticsSummary(period),
    staleTime: 60 * 60 * 1000,
  });
}
