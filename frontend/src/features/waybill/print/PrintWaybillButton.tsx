import { useWaybill } from "@/_libs/services/queries/waybills.queries";
import { useEffect, useRef } from "react";
import { WaybillPrintContent } from "./WaybillPrintContent";
import { useSetting } from "@/_libs/services/queries/setting.queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Print } from "../../../../wailsjs/go/main/App";

interface Props {
  waybillId: number;
  onClose?: () => void;
}

export function PrintWaybillButton({ waybillId, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const printStartedRef = useRef(false);
  const { data: waybill, isLoading: isLoadingWaybill } = useWaybill(waybillId);
  const { data: setting, isLoading: isLoadingSetting } = useSetting();

  useEffect(() => {
    if (
      !waybill ||
      isLoadingWaybill ||
      isLoadingSetting ||
      !printRef.current ||
      printStartedRef.current
    ) {
      return;
    }

    const closeAfterPrint = () => onClose?.();
    const frame = requestAnimationFrame(async () => {
      printStartedRef.current = true;

      window.addEventListener("afterprint", closeAfterPrint, { once: true });

      try {
        await document.fonts?.ready;
        await Print();
      } catch (error) {
        window.removeEventListener("afterprint", closeAfterPrint);
        console.error("Print error:", error);
        toast.error("چاپ بارنامه با خطا مواجه شد");
        onClose?.();
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", closeAfterPrint);
    };
  }, [waybill, isLoadingWaybill, isLoadingSetting, onClose]);

  return (
    <>
      {(isLoadingWaybill || isLoadingSetting) && (
        <span className="sr-only" role="status" aria-live="polite">
          <Spinner /> آماده‌سازی بارنامه برای چاپ
        </span>
      )}

      {waybill && (
        <div
          id="wails-waybill-print"
          className="pointer-events-none fixed -left-[10000px] top-0"
          aria-hidden="true"
        >
          <WaybillPrintContent
            ref={printRef}
            waybill={waybill}
            setting={setting}
          />
        </div>
      )}
    </>
  );
}
