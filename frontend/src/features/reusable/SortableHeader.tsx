import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";

interface Props<T> {
  column: Column<T>;
  title: string;
}

export function SortableHeader<T>({ column, title }: Props<T>) {
  const sorted = column.getIsSorted();

  return (
    <button
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="flex items-center gap-1 cursor-pointer font-medium hover:text-primary transition-colors"
    >
      {title}

      {sorted === "asc" && <ArrowUp className="h-4 w-4" />}
      {sorted === "desc" && <ArrowDown className="h-4 w-4" />}
      {!sorted && <ArrowUpDown className="h-4 w-4 opacity-50" />}
    </button>
  );
}
