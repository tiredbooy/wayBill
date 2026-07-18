import ModalShell from "@/features/reusable/ModalShell";
import CreateOrEditCustomerSection from "./CreateOrEditCustomerSection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shouldNavigate?: boolean;
}

export default function CreateCustomerModal({
  open,
  onOpenChange,
  shouldNavigate,
}: Props) {
  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="ساخت مشتری">
      <CreateOrEditCustomerSection
        mode="create"
        shouldNavigate={shouldNavigate}
      />
    </ModalShell>
  );
}
