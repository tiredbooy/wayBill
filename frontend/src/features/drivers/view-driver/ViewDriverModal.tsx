import { useDriver } from "@/_libs/services/queries/drivers.queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDriverActionStore } from "@/stores/useDriverIdStore";
import { useShallow } from "zustand/react/shallow";

export default function ViewDriverModal() {
  const { driverID, reset } = useDriverActionStore(
    useShallow((s) => ({
      driverID: s.driverID,
      reset: s.reset,
    })),
  );

  const { data: driver, isLoading } = useDriver(Number(driverID));

  return (
    <Dialog modal={true} open={!!driverID} onOpenChange={() => reset()}>
      <DialogOverlay />
      <DialogContent dir="rtl" className="!max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-muted-foreground text-center">
                جزئیات راننده
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-6 pb-8 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    نام و نام خانوادگی
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.first_name} {driver?.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    شماره موبایل
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.phone ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ایمیل
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.email ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    آدرس
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.address ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    کد ملی
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.national_code ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    مدل ماشین
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.vehicle_model ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    شماره پلاک 
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.vehicle_plate ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    تاریخ تولد
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {new Date(driver?.birth_date as string).toLocaleDateString(
                      "fa-IR",
                    ) ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    شماره گواهینامه
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {driver?.license_number ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    تاریخ ثبت
                  </p>
                  <p className="text-lg font-semibold text-foreground/80">
                    {new Date(driver?.created_at as string).toLocaleDateString(
                      "fa-IR",
                    ) ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="destructive" onClick={() => reset()}>
                  بستن
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
