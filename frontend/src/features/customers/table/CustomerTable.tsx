import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CustomerDetail } from "@/_libs/types/customer-types";
import { DataPagination } from "@/features/reusable/Pagination/data-pagination";
import { useCustomerActionStore } from "@/stores/useCustomerIdStore";
import { makeCustomerColumns } from "./Columns";
import { ViewCustomerModal } from "../view-customer/ViewCustomerModal";

interface Props {
  data: CustomerDetail[];
}

export function CustomersTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  const { customerId } = useCustomerActionStore(
    useShallow((s) => ({ customerId: s.customerId }))
  );

  const table = useReactTable({
    data,
    columns: makeCustomerColumns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="rounded-lg border bg-background">
        <Table dir="rtl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-right select-none">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={makeCustomerColumns.length}
                  className="text-center"
                >
                  مشتری‌ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-t p-4">
          <DataPagination
            page={pageIndex + 1}
            pageSize={pageSize}
            total={data.length}
            onPageChange={(page) => setPageIndex(page - 1)}
          />
        </div>
      </div>

      {customerId && <ViewCustomerModal />}
    </>
  );
}