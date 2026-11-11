"use client";

import { useMemo, useState } from "react";
import { useGetAllAvailability } from "@/hooks/admin.hook";
import type { Availability } from "@/types";
import { Input } from "@/components/ui/input";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminAvailabilityPage() {
  const { data, isLoading, isError, refetch } =
    useGetAllAvailability();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const availability: Availability[] = data?.data ?? [];

  const filtered = useMemo(() => {
    return availability.filter((item) => {
      const name = item.provider?.user?.name ?? "";
      const email = item.provider?.user?.email ?? "";
      const query = search.toLowerCase().trim();

      const matchesSearch =
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query);

      const matchesStatus =
        filter === "ALL" ||
        (filter === "AVAILABLE" && item.isAvailable) ||
        (filter === "UNAVAILABLE" && !item.isAvailable);

      return matchesSearch && matchesStatus;
    });
  }, [availability, search, filter]);

  const columns: DataTableColumn<Availability>[] = [
    {
      key: "provider",
      header: "Provider",
      cell: (item) => item.provider?.user?.name ?? "—",
    },
    {
      key: "email",
      header: "Email",
      cell: (item) => item.provider?.user?.email ?? "—",
    },
    {
      key: "day",
      header: "Day",
      cell: (item) => days[item.dayOfWeek] ?? "Unknown",
    },
    {
      key: "startTime",
      header: "Start Time",
      cell: (item) => item.startTime,
    },
    {
      key: "endTime",
      header: "End Time",
      cell: (item) => item.endTime,
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <span className="rounded-full border px-2 py-1 text-xs">
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-destructive">
          Failed to load availability.
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
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Provider Availability
        </h1>
        <p className="text-sm text-muted-foreground">
          View provider schedules and availability.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No availability records found"
        emptyDescription="No schedules match your search or selected filter."
        caption={`Showing ${filtered.length} of ${availability.length} schedules`}
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search provider name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-md"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter availability"
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="ALL">All schedules</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
