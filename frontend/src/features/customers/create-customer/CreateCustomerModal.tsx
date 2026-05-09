import ModalShell from "@/features/reusable/ModalShell";
import type { Dispatch, SetStateAction } from "react";
import CreateOrEditCustomerSection from "./CreateOrEditCustomerSection";

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  shouldNavigate?: boolean;
}

export default function CreateCustomerModal({ open, shouldNavigate }: Props) {
  return (
    <ModalShell open={open} onOpenChange={(open) => !open} title={"ساخت مشتری"}>
      <CreateOrEditCustomerSection
        mode="create"
        shouldNavigate={shouldNavigate}
      />
    </ModalShell>
  );
}
