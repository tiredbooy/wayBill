import { useVehicles } from "@/_libs/services/queries/vehicles.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehiclesTable } from "@/features/vehicles/vehicles-table/VehiclesTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useVehicles({
    q: search?.trim(),
  });

  const vehicles = data?.results ?? [];

  /* ----------------------------- */
  /* Handlers                      */
  /* ----------------------------- */
  function handleAddDriver() {
    navigate("new");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ───────── Page Header ───────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">خودروها</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت خودروها، اطلاعات و وضعیت فعالیت
          </p>
        </div>

        <Button disabled={isLoading} onClick={handleAddDriver}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن خودرو جدید
        </Button>
      </div>

      {/* ───────── Toolbar ───────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          disabled={isLoading}
          placeholder="جستجو بر اساس نام، شماره تماس یا کد ملی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* ───────── Table ───────── */}
      <VehiclesTable data={vehicles} />
    </div>
  );
}
