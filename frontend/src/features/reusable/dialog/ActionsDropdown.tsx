// ActionDropdown.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, Printer, Trash } from "lucide-react";

interface Props {
  view?: boolean;
  haveDelete?: boolean;
  edit?: boolean;
  print?: boolean;
  onView?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onEdit?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onPrint?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ActionDropdown({
  view = false,
  haveDelete = false,
  edit = false,
  print = false,
  onEdit,
  onView,
  onDelete,
  onPrint,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer hover:bg-muted/70"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {view && (
          <DropdownMenuItem
            onClick={(e) => onView?.(e)}
            className="flex flex-row-reverse items-center justify-end gap-2 cursor-pointer text-right"
          >
            مشاهده
            <Eye className="h-4 w-4 shrink-0" />
          </DropdownMenuItem>
        )}
        {edit && (
          <DropdownMenuItem
            onClick={(e) => onEdit?.(e)}
            className="flex flex-row-reverse items-center justify-end gap-2 cursor-pointer text-right"
          >
            ویرایش
            <Pencil className="h-4 w-4 shrink-0" />
          </DropdownMenuItem>
        )}
        {print && (
          <DropdownMenuItem
            onClick={(e) => onPrint?.(e)}
            className="flex flex-row-reverse items-center justify-end gap-2 cursor-pointer text-right"
          >
            چاپ
            <Printer className="h-4 w-4 shrink-0" />
          </DropdownMenuItem>
        )}
        {haveDelete && (
          <DropdownMenuItem
            className="flex flex-row-reverse items-center justify-end gap-2 cursor-pointer text-right text-destructive focus:bg-destructive/10"
            variant="destructive"
            onClick={(e) => onDelete?.(e)}
          >
            حذف
            <Trash className="h-4 w-4 shrink-0" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
