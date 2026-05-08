import type { VehicleResponse } from "@/_libs/types/vehicle-types";
import type { ColumnDef } from "@tanstack/react-table";
import VehicleActions from "../VehicleActions";
import { convertToPersianDigits } from "@/_libs/utils/helper";

export const makeVehicleColumns: ColumnDef<VehicleResponse>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
  },
  {
    accessorKey: "model",
    header: "مدل",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {s.model || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "plate",
    header: "پلاک",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(s.plate) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "driver",
    header: "راننده",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {s?.driver ?? "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "سال",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(s?.year) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "نحمل وزن",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {convertToPersianDigits(s?.capacity) || "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "insurance_expiry",
    header: "انقظای بیمه",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">
            {new Date(s.insurance_expiry || "-").toLocaleDateString("fa-IR")}
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
      return <VehicleActions vehicleID={s?.id} />;
    },
  },
];
