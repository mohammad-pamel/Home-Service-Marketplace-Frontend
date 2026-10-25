
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetAllWorkLogs } from "@/hooks/admin.hook";
import type { WorkLog } from "@/types";

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
}

export function WorkLogListTable() {
  const { data, isLoading, isError } = useGetAllWorkLogs();

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
      ].some((value) => value?.toLowerCase().includes(keyword));

      const status = log.completedAt ? "COMPLETED" : "IN_PROGRESS";

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workLogs, search, statusFilter]);

  if (isLoading) {
    return <p className="p-4">Loading work logs...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Failed to load work logs. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
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

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Service</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Started At</th>
              <th className="p-3">Completed At</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredWorkLogs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{log.title}</div>
                  <div className="max-w-xs whitespace-normal text-xs text-muted-foreground">
                    {log.description || "No description"}
                  </div>
                </td>

                <td className="p-3">
                  {log.booking?.serviceRequest?.service?.name ?? "—"}
                </td>

                <td className="p-3">
                  <div>{log.booking?.customer?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.booking?.customer?.email}
                  </div>
                </td>

                <td className="p-3">
                  <div>{log.booking?.provider?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.booking?.provider?.email}
                  </div>
                </td>

                <td className="p-3">
                  <span title={log.bookingId}>
                    {log.bookingId.slice(0, 8)}...
                  </span>
                </td>

                <td className="p-3">{formatDate(log.startedAt)}</td>

                <td className="p-3">{formatDate(log.completedAt)}</td>

                <td className="p-3">
                  <span
                    className={
                      log.completedAt
                        ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                        : "rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
                    }
                  >
                    {log.completedAt ? "Completed" : "In Progress"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredWorkLogs.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-muted-foreground"
                >
                  No work logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredWorkLogs.length} of {workLogs.length} work logs
      </p>
    </div>
  );
}
