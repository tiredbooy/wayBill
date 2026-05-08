import { downloadWaybillsCSV } from "@/_libs/services/api/waybills-api";
import { useWaybills } from "@/_libs/services/queries/waybills.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WaybillsTable } from "@/features/waybill/table/WaybillsTable";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DownloadFile } from "../../wailsjs/go/main/App"

export default function WaybillsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { data, isLoading } = useWaybills({ search: search?.trim() });

  const waybills = data?.results ?? [];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadWaybillsCSV({ search: search?.trim() || "" });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64content = base64data.split(",")[1];
        DownloadFile(base64content, `لیست-بارنامه.csv`);
        toast.success("فایل CSV ذخیره شد");
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">بارنامه‌ها</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت بارنامه‌ها و مشاهده جزئیات
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={downloading || isLoading}
          >
            <Download className="ml-2 h-4 w-4" />
            {downloading ? "در حال دانلود..." : "خروجی اکسل"}
          </Button>
          <Button disabled={isLoading} onClick={() => navigate("new")}>
            <Plus className="ml-2 h-4 w-4" />
            بارنامه جدید
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          disabled={isLoading}
          placeholder="جستجو بر اساس شماره بارنامه، فرستنده، گیرنده..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <WaybillsTable data={waybills} />
    </div>
  );
}
