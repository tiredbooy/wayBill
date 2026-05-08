import ModalShell from "@/features/reusable/ModalShell";
import CreateOrEditDriverSection from "./CreateOrEditDriverSection";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export default function CreateDriverModal ({ open }: Props) {
  return (
    <ModalShell open={open} onOpenChange={(open) => !open} title={"ساخت راننده"}>
      <CreateOrEditDriverSection mode="create" />
    </ModalShell>
  );
};
