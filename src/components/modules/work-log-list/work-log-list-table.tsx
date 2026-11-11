"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import { useGetAllWorkLogs } from "@/hooks/admin.hook";
import type { WorkLog } from "@/types";

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
}

export function WorkLogListTable() {
  const { data, isLoading, isError, refetch } = useGetAllWorkLogs();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const workLogs: WorkLog[] = data?.data ?? [];

  const filteredWorkLogs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return workLogs.filter((log) => {
      const matchesSearch = [
        log.title,
        log.description,
        log.bookingId,
        log.booking?.customer?.name,
        log.booking?.customer?.email,
        log.booking?.provider?.name,
        log.booking?.provider?.email,
        log.booking?.serviceRequest?.service?.name,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(keyword),
      );

      const status = log.completedAt ? "COMPLETED" : "IN_PROGRESS";

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workLogs, search, statusFilter]);

  const columns: DataTableColumn<WorkLog>[] = [
    {
      key: "title",
      header: "Title",
      cell: (log) => (
        <div className="min-w-40">
          <p className="font-medium">{log.title}</p>
          <p className="max-w-xs whitespace-normal text-xs text-muted-foreground">
            {log.description || "No description"}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (log) =>
        log.booking?.serviceRequest?.service?.name ?? "—",
    },
    {
      key: "customer",
      header: "Customer",
      cell: (log) => (
        <div>
          <p>{log.booking?.customer?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {log.booking?.customer?.email ?? ""}
          </p>
        </div>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (log) => (
        <div>
          <p>{log.booking?.provider?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {log.booking?.provider?.email ?? ""}
          </p>
        </div>
      ),
    },
    {
      key: "bookingId",
      header: "Booking ID",
      cell: (log) => (
        <span className="font-mono text-xs" title={log.bookingId}>
          {log.bookingId.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "startedAt",
      header: "Started At",
      cell: (log) => (
        <span className="whitespace-nowrap">
          {formatDate(log.startedAt)}
        </span>
      ),
    },
    {
      key: "completedAt",
      header: "Completed At",
      cell: (log) => (
        <span className="whitespace-nowrap">
          {formatDate(log.completedAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (log) => (
        <span
          className={
            log.completedAt
              ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
              : "rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
          }
        >
          {log.completedAt ? "Completed" : "In Progress"}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-3 rounded-md border p-6">
        <p className="text-sm text-destructive">
          Failed to load work logs. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredWorkLogs}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No work logs found"
        emptyDescription="No work logs match your search or selected status."
        caption={`Showing ${filteredWorkLogs.length} of ${workLogs.length} work logs`}
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search title, booking, customer, provider..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-sm"
            />

            <select
              aria-label="Filter work logs by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
