import { DialogContent } from "@/components/animate-ui/components/radix/dialog";
import { Dialog } from "@/components/animate-ui/primitives/radix/dialog";
import CreateVehicleSection from "./CreateOrEditVehicleSection";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  shouldNavigate?: boolean;
}

export default function CreateVehicleModal({ open, shouldNavigate }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <CreateVehicleSection
          breadCrump={false}
          shouldNavigate={shouldNavigate}
        />
      </DialogContent>
    </Dialog>
  );
}
