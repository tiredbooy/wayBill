import type { DriverResponse } from "@/_libs/types/driver-types";
import type { ColumnDef } from "@tanstack/react-table";
import { DriverActions } from "./DriverActions";
import { convertToPersianDigits } from "@/_libs/utils/helper";

export const makeDriverColumns: ColumnDef<DriverResponse>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
  },
  {
    accessorKey: "name",
    header: "نام",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {s.first_name} {s.last_name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "national-code",
    header: "کدملی",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(s?.national_code) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "تلفن",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(s.phone) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "total-waybills",
    header: "تعداد سفرها",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(Number(s?.total_waybills)) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "license-expiry",
    header: "انقضای گواهینامه",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {new Date(s.license_expiry).toLocaleDateString("fa-IR") || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "تاریخ ثبت",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {new Date(s.created_at || "-").toLocaleDateString("fa-IR")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "فعالیت",
    cell: ({ row }) => {
      const s = row.original;
      return <DriverActions driverID={s?.id} />;
    },
  },
];
