import { useAnalyticsSummary } from "@/_libs/services/queries/analytics.queries";
import DashboardContent from "@/features/dashboard/DashboardContent";
import { useState } from "react";

export default function DashboardPage() {
  const [period, setPeriod] = useState("7d");
  const { data, isLoading, error, refetch } = useAnalyticsSummary(period);


  return (
    <DashboardContent
      data={data || null}
      loading={isLoading}
      error={error?.message || ""}
      period={period}
      onPeriodChange={setPeriod}
      onRetry={refetch}
    />
  );
}
