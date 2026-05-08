import { useLocations } from "@/_libs/services/queries/locations.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationsTable } from "@/features/locations/table/LocationTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateLocationModal from "@/features/locations/CreateLocationModal";

export default function LocationsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useLocations({ q: search });

  const locations = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">موقعیت‌ها</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت مبداها و مقصدها (شهرها، پایانه‌ها)
          </p>
        </div>
        <Button disabled={isLoading} onClick={() => setOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن موقعیت جدید
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          disabled={isLoading}
          placeholder="جستجو بر اساس نام یا استان..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <LocationsTable data={locations} />

      {/* Create Modal */}
      <CreateLocationModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
