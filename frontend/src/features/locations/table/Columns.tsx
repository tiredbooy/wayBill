import type { LocationDetail } from "@/_libs/types/location-types";
import type { ColumnDef } from "@tanstack/react-table";
import { LocationActions } from "./LocationActions";
import { convertToPersianDigits } from "@/_libs/utils/helper";

export const makeLocationColumns: ColumnDef<LocationDetail>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => convertToPersianDigits(row.original.id),
  },
  {
    accessorKey: "name",
    header: "نام موقعیت",
  },
  {
    accessorKey: "province",
    header: "استان",
  },
  {
    accessorKey: "is_terminal",
    header: "پایانه",
    cell: ({ row }) => (row.original.is_terminal ? "بله" : "خیر"),
  },
  {
    accessorKey: "address",
    header: "آدرس",
    cell: ({ row }) => row.original.address || "—",
  },
  {
    accessorKey: "created_at",
    header: "تاریخ ثبت",
    cell: ({ row }) => new Date(row?.original?.created_at).toLocaleDateString("fa-IR"),
  },
  {
    accessorKey: "actions",
    header: "فعالیت",
    cell: ({ row }) => <LocationActions locationId={row.original.id} />,
  },
];