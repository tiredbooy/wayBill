import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  TrendingUp,
  Percent,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";
import { PERIODS } from "@/_libs/services/api/analytics-api";
import { convertToPersianDigits } from "@/_libs/utils/helper";

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
  top_senders?: { name: string; count: number }[];
  top_receivers?: { name: string; count: number }[];
}

interface DashboardContentProps {
  data: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  period: string;
  onPeriodChange: (value: string) => void;
}

export default function DashboardContent({
  data,
  loading,
  error,
  onRetry,
  period,
  onPeriodChange,
}: DashboardContentProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value) + " تومان";

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={onRetry}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8" dir="rtl">
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">داشبورد</h1>
          <p className="text-muted-foreground">
            خلاصه‌ای از وضعیت بارنامه‌ها و درآمد
          </p>
        </div>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="انتخاب بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          : data && (
              <>
                {/* Total Waybills */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      کل بارنامه‌ها
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.total_waybills)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      در این بازه
                    </p>
                  </CardContent>
                </Card>

                {/* Active Waybills */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">فعال</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.active_waybills)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      در حال انجام
                    </p>
                  </CardContent>
                </Card>

                {/* Delivered */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      تحویل شده
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.delivered_waybills)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      تکمیل شده
                    </p>
                  </CardContent>
                </Card>

                {/* Total Freight */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      کل کرایه
                    </CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(data.total_freight)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      میانگین: {formatCurrency(data.average_freight)}
                    </p>
                  </CardContent>
                </Card>

                {/* Total Amount */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      مبلغ کل
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(data.total_amount)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      مجموع بارنامه‌ها
                    </p>
                  </CardContent>
                </Card>

                {/* Revenue (commission) */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      درآمد (کمیسیون)
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Number(data?.revenue?.toFixed(0)))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      نرخ: {convertToPersianDigits(data.commission_rate)}٪
                    </p>
                  </CardContent>
                </Card>

                {/* Commission Rate */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      نرخ کمیسیون
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {convertToPersianDigits(data.commission_rate)}٪
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
      </div>

      {/* Top Senders (conditional) */}
      {!loading && data?.top_senders && data.top_senders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              برترین فرستنده‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام فرستنده</TableHead>
                  <TableHead className="text-right">تعداد بارنامه</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.top_senders.map((sender, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sender.name}</TableCell>
                    <TableCell className="">
                      <Badge variant="secondary">{sender.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Top Receivers (future, conditional) */}
      {!loading && data?.top_receivers && data.top_receivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              برترین گیرنده‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام گیرنده</TableHead>
                  <TableHead className="text-right">تعداد بارنامه</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.top_receivers.map((recv, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{recv.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{recv.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
