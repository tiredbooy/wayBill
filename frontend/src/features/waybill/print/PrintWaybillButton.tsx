import { useWaybill } from "@/_libs/services/queries/waybills.queries";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { WaybillPrintContent } from "./WaybillPrintContent";
import { useSetting } from "@/_libs/services/queries/setting.queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const pageStyle = `
  @page {
    size: A4 portrait;
    margin: 8mm;
  }
  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .waybill-print {
      width: 194mm !important;
      max-width: 194mm !important;
      margin: 0 auto !important;
      padding: 0 !important;
    }
    .waybill-print-section {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

interface Props {
  waybillId: number;
  onClose?: () => void;
}

export function PrintWaybillButton({ waybillId, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const printStartedRef = useRef(false);
  const { data: waybill, isLoading: isLoadingWaybill } = useWaybill(waybillId);
  const { data: setting, isLoading: isLoadingSetting } = useSetting();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Waybill_${waybillId}`,
    pageStyle,
    onAfterPrint: () => onClose?.(),
    onPrintError: (_location, error) => {
      console.error("Print error:", error);
      toast.error("چاپ بارنامه با خطا مواجه شد");
      onClose?.();
    },
  });

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

    const frame = requestAnimationFrame(() => {
      printStartedRef.current = true;
      handlePrint();
    });
    return () => cancelAnimationFrame(frame);
  }, [waybill, isLoadingWaybill, isLoadingSetting, handlePrint]);

  return (
    <>
      {(isLoadingWaybill || isLoadingSetting) && (
        <span className="sr-only" role="status" aria-live="polite">
          <Spinner /> آماده‌سازی بارنامه برای چاپ
        </span>
      )}

      {waybill && (
        <div className="pointer-events-none fixed -left-[10000px] top-0" aria-hidden="true">
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
