import { DialogContent } from "@/components/animate-ui/components/radix/dialog";
import { Dialog } from "@/components/animate-ui/primitives/radix/dialog";
import CreateVehicleSection from "./CreateOrEditVehicleSection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shouldNavigate?: boolean;
}

export default function CreateVehicleModal({
  open,
  onOpenChange,
  shouldNavigate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <CreateVehicleSection
          breadCrump={false}
          shouldNavigate={shouldNavigate}
        />
      </DialogContent>
    </Dialog>
  );
}
