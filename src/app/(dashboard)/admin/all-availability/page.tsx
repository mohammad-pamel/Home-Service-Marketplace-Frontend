
"use client";

import { useMemo, useState } from "react";
import { useGetAllAvailability } from "@/hooks/admin.hook";
import type { Availability } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading availability...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p>Failed to load availability.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Provider Availability</h1>
        <p className="text-sm text-muted-foreground">
          View provider schedules and availability.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
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

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No availability records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.provider?.user?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {item.provider?.user?.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    {days[item.dayOfWeek] ?? "Unknown"}
                  </TableCell>
                  <TableCell>{item.startTime}</TableCell>
                  <TableCell>{item.endTime}</TableCell>
                  <TableCell>
                    <span className="rounded-full border px-2 py-1 text-xs">
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {availability.length} schedules
      </p>
    </div>
  );
}
