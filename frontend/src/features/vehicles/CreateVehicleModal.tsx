import { DialogContent } from "@/components/animate-ui/components/radix/dialog";
import { Dialog } from "@/components/animate-ui/primitives/radix/dialog";
import CreateVehicleSection from "./CreateOrEditVehicleSection";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>
}

export default function CreateVehicleModal({ open }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <CreateVehicleSection breadCrump={false} />
      </DialogContent>
    </Dialog>
  );
}
