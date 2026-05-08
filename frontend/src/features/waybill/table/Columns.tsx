import type { WaybillResponse } from "@/_libs/types/waybill-types";
import type { ColumnDef } from "@tanstack/react-table";
import { WaybillActions } from "./WaybillActions";
import { convertToPersianDigits } from "@/_libs/utils/helper";

export const makeWaybillColumns: ColumnDef<WaybillResponse>[] = [
  {
    accessorKey: "id",
    header: "شماره بارنامه",
    cell: ({ row }) => convertToPersianDigits(row.original.id),
  },
  {
    accessorKey: "sender_name",
    header: "فرستنده",
  },
  {
    accessorKey: "receiver_name",
    header: "گیرنده",
  },
  {
    accessorKey: "driver_name",
    header: "راننده",
  },
  {
    accessorKey: "origin_location",
    header: "مبدا",
  },
  {
    accessorKey: "destination_location",
    header: "مقصد",
  },
  {
    accessorKey: "total_weight",
    header: "وزن (کیلوگرم)",
    cell: ({ row }) => convertToPersianDigits(row.original.total_weight),
  },
  {
    accessorKey: "payment_status",
    header: "وضعیت پرداخت",
    cell: ({ row }) => row.original.payment_status || "—",
  },
  {
    accessorKey: "total_amount",
    header: "مبلغ کل",
    cell: ({ row }) => convertToPersianDigits(row.original.total_amount?.toLocaleString() || "—"),
  },
  {
    accessorKey: "created_at",
    header: "تاریخ ثبت",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("fa-IR"),
  },
  {
    accessorKey: "actions",
    header: "فعالیت",
    cell: ({ row }) => <WaybillActions waybillId={row.original.id} />,
  },
];