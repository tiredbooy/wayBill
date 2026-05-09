import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumb } from "../reusable/BreadCrumpt";
import VehiclesForm from "./VehiclesForm";
import type { VehicleResponse } from "@/_libs/types/vehicle-types";

interface Props {
  mode?: "edit" | "create";
  vehicle?: VehicleResponse;
  breadCrump?: boolean
  shouldNavigate?: boolean
}

export default function CreateOrEditVehicleSection({ mode, vehicle, breadCrump, shouldNavigate }: Props) {
  return (
    <div className="flex flex-col px-4 py-8 gap-5">
      {breadCrump && <Breadcrumb
        labelMap={{
          dashboard: "داشبورد",
          vehicles: "خودروها",
          drivers: "رانندگان",
          new: "افزودن",
          edit: "ویرایش",
        }}
      />}

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-x1 font-bold">
            {mode === "create" ? "افزودن خودرو جدید" : "ویرایش خودرو"}
          </CardTitle>
          <CardDescription>
            لطفا اطلاعات خودرو را در فرو زیر وارد کنید.
          </CardDescription>
        </CardHeader>
      </Card>
      <VehiclesForm mode={mode} vehicle={vehicle} shouldNavigate={shouldNavigate} />
    </div>
  );
}
