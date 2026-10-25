"use client";

import { useMemo, useState } from "react";
import { useGetAllBookings } from "@/hooks/admin.hook";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@/types";

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

function formatDate(value?: string | null) {
  if (!value) return "Not specified";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingListTable() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("ALL");

  const bookings = data?.data ?? [];

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking : Booking) => {
      const customerName = booking.customer?.name ?? "";
      const customerEmail = booking.customer?.email ?? "";
      const providerName = booking.provider?.name ?? "";
      const providerEmail = booking.provider?.email ?? "";
      const serviceName = booking.serviceRequest?.service?.name ?? "";

      const matchesSearch =
        !term ||
        booking.id.toLowerCase().includes(term) ||
        customerName.toLowerCase().includes(term) ||
        customerEmail.toLowerCase().includes(term) ||
        providerName.toLowerCase().includes(term) ||
        providerEmail.toLowerCase().includes(term) ||
        serviceName.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  if (isLoading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-red-500">
          Failed to load bookings. Check the Admin bookings API and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search booking, customer, provider, or service..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-md"
        />

        <select
          aria-label="Filter bookings by status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as (typeof statusOptions)[number],
            )
          }
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "All Statuses" : status.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 rounded-md border px-4 text-sm disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Total bookings: {filteredBookings.length}
      </p>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Scheduled At</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking : Booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {booking.id}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-36">
                      <p>{booking.customer?.name ?? "N/A"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customer?.email ?? "N/A"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-36">
                      <p>{booking.provider?.name ?? "N/A"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.provider?.email ?? "N/A"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {booking.serviceRequest?.service?.name ?? "N/A"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(booking.scheduledAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    ৳{booking.totalAmount}
                  </TableCell>

                  <TableCell>
                    <span className="whitespace-nowrap rounded-md border px-2 py-1 text-xs">
                      {booking.status.replaceAll("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(booking.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}