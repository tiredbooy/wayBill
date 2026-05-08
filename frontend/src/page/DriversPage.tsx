import { Plus } from "lucide-react";
import { useState } from "react";

import { DriversTable } from "@/features/drivers/DriversTable";

import { useDrivers } from "@/_libs/services/queries/drivers.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function DriversPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useDrivers({
    // page,
    // limit,
    q: search?.trim() || undefined,
  });

  const drivers = data?.results || [];

  function handleAddDriver() {
    navigate("new");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ───────── Page Header ───────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">رانندگان</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت رانندگان، اطلاعات و وضعیت فعالیت
          </p>
        </div>

        <Button onClick={handleAddDriver}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن راننده جدید
        </Button>
      </div>
      {/* ───────── Toolbar ───────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="جستجو بر اساس نام، شماره تماس یا کد ملی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <p className="text-sm text-muted-foreground">
          نمایش {data?.total_items} راننده
        </p>
      </div>

      {/* ───────── Table ───────── */}
      <DriversTable data={drivers} isLoading={isLoading} />
    </div>
  );
}
