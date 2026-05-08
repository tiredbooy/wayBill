import { useLocation } from "@/_libs/services/queries/locations.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocationActionStore } from "@/stores/useLocationIdStore";
import { LocationDetailView } from "./LocationDetailView";
import { LocationForm } from "../LocationForm";
import { Spinner } from "@/components/ui/spinner";

export default function ViewLocationModal() {
  const { locationId, setLocationId } = useLocationActionStore();
  const { data, isLoading } = useLocation(locationId!);

  const isOpen = !!locationId;

  const handleClose = () => setLocationId(null);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>مشاهده و ویرایش موقعیت</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : data ? (
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">مشاهده</TabsTrigger>
              <TabsTrigger value="edit">ویرایش</TabsTrigger>
            </TabsList>
            <TabsContent value="view" className="mt-4">
              <LocationDetailView location={data} />
            </TabsContent>
            <TabsContent value="edit" className="mt-4">
              <LocationForm
                mode="edit"
                location={data}
                onSuccess={handleClose}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            موقعیت یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
