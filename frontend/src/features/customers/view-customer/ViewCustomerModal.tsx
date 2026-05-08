import { useCustomer } from "@/_libs/services/queries/customer.queries";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModalShell from "@/features/reusable/ModalShell";
import { useCustomerActionStore } from "@/stores/useCustomerIdStore";
import { CustomerForm } from "../create-customer/CustomerForm";
import { CustomerDetailView } from "./CustomerDetailView";

export function ViewCustomerModal() {
  const { customerId, setCustomerId } = useCustomerActionStore();
  const { data, isLoading } = useCustomer(customerId!);

  const isOpen = !!customerId;

  const handleClose = () => {
    setCustomerId(null);
  };

  return (
   <ModalShell open={isOpen}
   onOpenChange={(open) => !open && handleClose()}
   title={`مشاهده و ویرایش مشتری`}
   description={data ? `ججزئیات ${data?.name}` : "جزئیات مشتری"}
   size="lg"
   scroll="content"
   >
    {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : data ? (
          <Tabs dir="rtl" defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">مشاهده</TabsTrigger>
              <TabsTrigger value="edit">ویرایش</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="mt-4">
              <CustomerDetailView customer={data} />
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <CustomerForm
                mode="edit"
                customer={data}
                onSuccess={() => setCustomerId(null)}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            مشتری یافت نشد
          </div>
        )}
   </ModalShell>
  );
}
