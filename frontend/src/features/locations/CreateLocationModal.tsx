import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shouldNavigate?: boolean
}

export default function CreateLocationModal({ open, onOpenChange, shouldNavigate }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد موقعیت جدید</DialogTitle>
        </DialogHeader>
        <LocationForm mode="create" onSuccess={() => onOpenChange(false)} shouldNavigate={shouldNavigate} />
      </DialogContent>
    </Dialog>
  );
}