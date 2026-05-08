import { useState } from "react";
import { toast } from "sonner";
import { useDeleteWaybill } from "@/_libs/services/queries/waybills.queries";
import ActionDropdown from "@/features/reusable/dialog/ActionsDropdown";
import DeleteAlert from "@/features/reusable/dialog/DeleteAlert";
import { useWaybillActionStore } from "@/stores/useWaybillIdStore";
import { PrintWaybillButton } from "@/features/waybill/print/PrintWaybillButton";
import { downloadWaybillDetailCSV } from "@/_libs/services/api/waybills-api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DownloadFile } from "../../../../wailsjs/go/main/App";

interface Props {
  waybillId: number;
}

export function WaybillActions({ waybillId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const { setWaybillId } = useWaybillActionStore();
  const deleteWaybill = useDeleteWaybill();

  function deleteWaybillBtn(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
  }

  function handleDeleteWaybill() {
    deleteWaybill.mutate(waybillId, {
      onSuccess: () => toast.success("بارنامه حذف شد"),
    });
    setIsDeleting(false);
  }

  function handlePrint(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setShowPrint(true);
  }

  async function handleDownloadCSV(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDownloadingCSV(true);
    try {
      const blob = await downloadWaybillDetailCSV(waybillId);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64content = base64data.split(",")[1];
        DownloadFile(base64content, `بارنامه_${waybillId}.csv`);
        toast.success("فایل CSV ذخیره شد");
      };
      reader.readAsDataURL(blob);
    } catch (err: unknown) {
      toast.error("دانلود CSV با خطا مواجه شد");
    } finally {
      setDownloadingCSV(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadCSV}
          disabled={downloadingCSV}
          title="دانلود CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
        <ActionDropdown
          view
          edit
          haveDelete
          print
          onView={() => setWaybillId(waybillId)}
          onEdit={() => setWaybillId(waybillId)}
          onDelete={deleteWaybillBtn}
          onPrint={handlePrint}
        />
      </div>
      <DeleteAlert
        alertTitle="آیا از حذف این بارنامه اطمینان دارید ؟"
        alertDescription="بعد از حذف امکان بازگشت وجود ندارد"
        setIsOpen={setIsDeleting}
        isOpen={isDeleting}
        isLoading={deleteWaybill.isPending}
        actionClick={handleDeleteWaybill}
      />
      {showPrint && (
        <PrintWaybillButton
          waybillId={waybillId}
          onClose={() => setShowPrint(false)}
        />
      )}
    </>
  );
}
