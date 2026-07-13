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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      {breadCrump && <Breadcrumb
        labelMap={{
          dashboard: "داشبورد",
          vehicles: "خودروها",
          drivers: "رانندگان",
          new: "افزودن",
          edit: "ویرایش",
        }}
      />}

      <Card className="overflow-hidden border-primary/20 bg-linear-to-l from-primary/8 via-card to-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold md:text-2xl">
            {mode === "create" ? "ثبت بارنامه جدید" : "ویرایش بارنامه"}
          </CardTitle>
          <CardDescription>
            اطلاعات حمل، طرفین و مبالغ را تکمیل کنید. فیلدهای ضروری هنگام ذخیره مشخص می‌شوند.
          </CardDescription>
        </CardHeader>
      </Card>
      <WaybillForm mode={mode} waybill={waybill} />
    </main>
  );
};
