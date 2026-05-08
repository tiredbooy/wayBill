import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useCustomerActionStore } from "@/stores/useCustomerIdStore";
import { useDeleteCustomer } from "@/_libs/services/queries/customer.queries";
import { toast } from "sonner";

interface Props {
  customerId: number;
}

export function CustomerActions({ customerId }: Props) {
  const { setCustomerId } = useCustomerActionStore();
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = () => {
    if (confirm("آیا از حذف این مشتری اطمینان دارید؟")) {
      deleteCustomer.mutate(customerId, {
        onSuccess: () => toast.success("مشتری حذف شد"),
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
        <DropdownMenuItem onClick={() => setCustomerId(customerId)}>
          <Eye className="ml-2 h-4 w-4" /> مشاهده
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCustomerId(customerId)}>
          <Pencil className="ml-2 h-4 w-4" /> ویرایش
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="ml-2 h-4 w-4" /> حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}