
"use client";

import { useMemo, useState } from "react";
import { useGetAllBookings } from "@/hooks/admin.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

import type { Booking } from "@/types";

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

function formatDate(value?: string | Date | null) {
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

  const bookings: Booking[] = data?.data ?? [];

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
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

  // DataTable Columns
  const columns: DataTableColumn<Booking>[] = [
    {
      key: "bookingId",
      header: "Booking ID",
      cell: (booking) => (
        <span className="font-mono text-xs">{booking.id}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (booking) => (
        <div className="min-w-36">
          <p>{booking.customer?.name ?? "N/A"}</p>
          <p className="text-xs text-muted-foreground">
            {booking.customer?.email ?? "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (booking) => (
        <div className="min-w-36">
          <p>{booking.provider?.name ?? "N/A"}</p>
          <p className="text-xs text-muted-foreground">
            {booking.provider?.email ?? "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (booking) =>
        booking.serviceRequest?.service?.name ?? "N/A",
    },
    {
      key: "scheduledAt",
      header: "Scheduled At",
      cell: (booking) => (
        <span className="whitespace-nowrap">
          {formatDate(booking.scheduledAt)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (booking) => (
        <span className="whitespace-nowrap">
          ৳{booking.totalAmount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (booking) => (
        <span className="whitespace-nowrap rounded-md border px-2 py-1 text-xs">
          {booking.status.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (booking) => (
        <span className="whitespace-nowrap">
          {formatDate(booking.createdAt)}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-red-500">
          Failed to load bookings. Check the Admin bookings API and try again.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
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
              {status === "ALL"
                ? "All Statuses"
                : status.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Total bookings: {filteredBookings.length}
      </p>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No bookings found"
        emptyDescription="Try changing your search or status filter."
        caption="A list of all marketplace bookings."
      />
    </div>
  );
}
