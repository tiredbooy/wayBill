import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { MdWarningAmber } from "react-icons/md";

interface Props {
  alertTitle?: string;
  alertDescription?: string;
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionClick?: () => void;
}

export default function DeleteAlert({
  alertTitle = "آیا از حذف اطمینان دارید ؟",
  alertDescription = "توجه بعد از حذف امکان بازگشت وجود ندارد.",
  isOpen,
  isLoading,
  setIsOpen,
  actionClick,
}: Props) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-3 items-center text-destructive">
            <MdWarningAmber className="" />
            {alertTitle}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        <AlertDialogFooter className="flex flex-row justify-end gap-2">
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((isOpen: boolean) => !isOpen);
            }}
            variant="outline"
          >
            انصراف
          </AlertDialogCancel>
          <AlertDialogAction onClick={actionClick} variant="destructive">
            {isLoading ? <Spinner /> : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
