import type { CustomerDetail } from "@/_libs/types/customer-types";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Breadcrumb } from "@/features/reusable/BreadCrumpt";
import { CustomerForm } from "./CustomerForm";

interface Props {
  mode?: "edit" | "create";
  customer?: CustomerDetail;
}

export default function CreateOrEditCustomerSection({
  mode = "create",
  customer,
}: Props) {
  return (
    <div className="flex flex-col px-4 py-8 gap-5">
      <Breadcrumb
        labelMap={{
          dashboard: "داشبورد",
          customers: "مشتری ها",
          new: "افزودن",
          edit: "ویرایش",
        }}
      />
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold">
            {mode === "create" ? " افزودن مشتری جدید" : "ویرایش مشتری"}
          </CardTitle>
          <CardDescription>
            لطفاً اطلاعات مشتری را در فرم زیر وارد کنید.
          </CardDescription>
        </CardHeader>
      </Card>

      <CustomerForm mode={mode} customer={customer} />
    </div>
  );
}
