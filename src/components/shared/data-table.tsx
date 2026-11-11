
"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  caption?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  skeletonRows?: number;
};

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  toolbar,
  pagination,
  caption,
  emptyTitle = "No Data Found",
  emptyDescription = "There is no data to display right now.",
  emptyAction,
  skeletonRows = 6,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {toolbar}

      <div className="w-full overflow-x-auto rounded-xl border">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}

          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, index) => (
                <TableRow key={`skeleton-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
index}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <div className="h-5 w-full max-w-32 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-52 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="font-semibold">{emptyTitle}</p>

                    <p className="max-w-sm text-sm text-muted-foreground">
                      {emptyDescription}
                    </p>

                    {emptyAction}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={column.className}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && data.length > 0 && pagination}
    </div>
  );
}
