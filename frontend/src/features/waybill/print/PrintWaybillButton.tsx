import { useWaybill } from "@/_libs/services/queries/waybills.queries";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { WaybillPrintContent } from "./WaybillPrintContent";
import { useSetting } from "@/_libs/services/queries/setting.queries";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  waybillId: number;
  onClose?: () => void;
}

export function PrintWaybillButton({ waybillId, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: waybill, isLoading: isLoadingWaybill } = useWaybill(waybillId);
  const { data: setting, isLoading: isLoadingSetting } = useSetting();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Waybill_${waybillId}`,
    onPrintError: (error) => console.error("Print error:", error),
  });

  // When data is loaded, print and then clean up
  useEffect(() => {
    if (waybill && printRef.current) {
      setTimeout(() => {
        handlePrint();
        setTimeout(() => {
          onClose?.();
        }, 500);
      }, 100);
    }
  }, [waybill, handlePrint, onClose]);

  return (
    <>
      {isLoadingWaybill || (isLoadingSetting && <Spinner />)}

      {waybill && (
        <div style={{ display: "none" }}>
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
