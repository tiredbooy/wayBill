import type { CustomerDetail } from "@/_libs/types/customer-types";
import type { ColumnDef } from "@tanstack/react-table";
import { CustomerActions } from "./CustomerActions";
import { convertToPersianDigits } from "@/_libs/utils/helper";

export const makeCustomerColumns: ColumnDef<CustomerDetail>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => convertToPersianDigits(row.original.id),
  },
  {
    accessorKey: "name",
    header: "نام مشتری",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {row.original.name}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "national_id",
    header: "کد ملی / شناسه ملی",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {convertToPersianDigits(row.original.national_id) || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone_mobile",
    header: "تلفن همراه",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {convertToPersianDigits(String(row?.original.phone_mobile)) || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone_fixed",
    header: "تلفن ثابت",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {convertToPersianDigits(String(row?.original.phone_fixed)) || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "شهر",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {row.original.city || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "استان",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {row.original.province || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "تاریخ ثبت",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {new Date(row.original.created_at).toLocaleDateString("fa-IR")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "فعالیت",
    cell: ({ row }) => <CustomerActions customerId={row.original.id} />,
  },
];