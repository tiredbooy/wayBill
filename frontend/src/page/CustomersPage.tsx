import { useCustomers } from "@/_libs/services/queries/customer.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomersTable } from "@/features/customers/table/CustomerTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCustomers({
    q: search?.trim(),
  });

  const customers = data?.results ?? [];

  function handleAddCustomer() {
    navigate("new");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">مشتریان</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت مشتریان، اطلاعات تماس و آدرس
          </p>
        </div>

        <Button disabled={isLoading} onClick={handleAddCustomer}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن مشتری جدید
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          disabled={isLoading}
          placeholder="جستجو بر اساس نام، کد ملی یا تلفن..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <CustomersTable data={customers} />
    </div>
  );
}