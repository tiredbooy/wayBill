import ModalShell from "@/features/reusable/ModalShell";
import CreateOrEditDriverSection from "./CreateOrEditDriverSection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shouldNavigate?: boolean;
}

export default function CreateDriverModal({
  open,
  onOpenChange,
  shouldNavigate,
}: Props) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={"ساخت راننده"}
    >
      <CreateOrEditDriverSection
        mode="create"
        shouldNavigate={shouldNavigate}
      />
    </ModalShell>
  );
}
