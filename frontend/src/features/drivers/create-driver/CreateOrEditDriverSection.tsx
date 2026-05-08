import type { DriverDetail } from "@/_libs/types/driver-types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumb } from "@/features/reusable/BreadCrumpt";
import { DriverForm } from "./DriverForm";

interface Props {
  mode?: "edit" | "create";
  driver?: DriverDetail;
}

export default function CreateOrEditDriverSection({
  mode = "create",
  driver,
}: Props) {
  return (
    <div className="flex flex-col px-4 py-8 gap-5">
      <Breadcrumb
        labelMap={{
          dashboard: "داشبورد",
          drivers: "رانندگان",
          new: "افزودن",
          edit: "ویرایش",
        }}
      />
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold">
            {mode === "create" ? " افزودن راننده جدید" : "ویرایش راننده"}
          </CardTitle>
          <CardDescription>
            لطفاً اطلاعات راننده را در فرم زیر وارد کنید.
          </CardDescription>
        </CardHeader>
      </Card>

      <DriverForm mode={mode} driver={driver} />
    </div>
  );
}
