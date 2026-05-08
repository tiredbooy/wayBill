import type { WaybillDetail } from "@/_libs/types/waybill-types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/features/reusable/BreadCrumpt";
import { WaybillForm } from "./WaybillForm";

interface Props {
  mode?: "edit" | "create"
  waybill?: WaybillDetail
  breadCrump ?: boolean
}

export default function CreateOrEditWaybillSection ({ mode = "create", waybill, breadCrump }: Props) {
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
      <WaybillForm mode={mode} waybill={waybill} />
    </div>
  );
};
