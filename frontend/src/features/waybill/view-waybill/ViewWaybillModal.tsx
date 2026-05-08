import { useWaybill } from "@/_libs/services/queries/waybills.queries";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModalShell from "@/features/reusable/ModalShell";
import { useWaybillActionStore } from "@/stores/useWaybillIdStore";
import { WaybillForm } from "../create-waybill/WaybillForm";
import { WaybillDetailView } from "./WaybillDetailView";

export default function ViewWaybillModal() {
  const { waybillId, setWaybillId } = useWaybillActionStore();
  const { data, isLoading } = useWaybill(waybillId!);

  const isOpen = !!waybillId;

  const handleClose = () => setWaybillId(null);

  return (
    <ModalShell
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="مشاهده و ویرایش بارنامه"
      size="xl"
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
            <WaybillDetailView waybill={data} />
          </TabsContent>
          <TabsContent value="edit" className="mt-4">
            <WaybillForm
              mode="edit"
              waybill={data}
              onSuccess={() => setWaybillId(null)}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          بارنامه یافت نشد
        </div>
      )}
    </ModalShell>
  );
}
