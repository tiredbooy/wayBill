import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useLocationActionStore } from "@/stores/useLocationIdStore";
import { useDeleteLocation } from "@/_libs/services/queries/locations.queries";
import { toast } from "sonner";

interface Props {
  locationId: number;
}

export function LocationActions({ locationId }: Props) {
  const { setLocationId } = useLocationActionStore();
  const deleteLocation = useDeleteLocation();

  const handleDelete = () => {
    if (confirm("آیا از حذف این موقعیت اطمینان دارید؟")) {
      deleteLocation.mutate(locationId, {
        onSuccess: () => toast.success("موقعیت حذف شد"),
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocationId(locationId)}>
          <Eye className="ml-2 h-4 w-4" /> مشاهده
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocationId(locationId)}>
          <Pencil className="ml-2 h-4 w-4" /> ویرایش
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="ml-2 h-4 w-4" /> حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}