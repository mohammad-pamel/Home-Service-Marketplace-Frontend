
"use client";

import { useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  CalendarCheck,
  UserRound,
  CreditCard,
} from "lucide-react";

import { useGetMyBookings } from "@/hooks/customer.hook";
import type { Booking } from "@/types/booking.type";

type BookingStatus = Booking["status"];

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getAmount(amount: number | string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "—";

  return value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MyBookingsPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetMyBookings();

  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>(
    "ALL",
  );

  // Expected response: { success, data: Booking[], meta }
  const response = data as { data?: Booking[] } | undefined;
  const bookings = response?.data ?? [];

  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);

  const activeCount = bookings.filter((booking) =>
    ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(booking.status),
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;

  return (
    <main className="space-y-6 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Customer Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View your scheduled services and booking history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Bookings"
          value={isLoading ? "..." : bookings.length}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <SummaryCard
          title="Active Bookings"
          value={isLoading ? "..." : activeCount}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <SummaryCard
          title="Completed"
          value={isLoading ? "..." : completedCount}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <SummaryCard
          title="Cancelled"
          value={isLoading ? "..." : cancelledCount}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Booking History</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter bookings by their current status.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "ALL" | BookingStatus)
          }
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter bookings by status"
        >
          <option value="ALL">All Bookings</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </section>

      {isLoading ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          Loading your bookings...
        </div>
      ) : isError ? (
        <div className="space-y-3 rounded-xl border p-8 text-center">
          <p className="text-sm text-red-500">
            Failed to load your bookings.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-xl border px-5 py-12 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            {bookings.length === 0
              ? "No bookings yet"
              : "No bookings match this filter"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {bookings.length === 0
              ? "Your confirmed service bookings will appear here."
              : "Choose another status to see more bookings."}
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {booking.serviceRequest?.service?.name ??
                      "Home Service Booking"}
                  </h3>
                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    Booking ID: {booking.id}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Scheduled Date"
                  value={formatDate(booking.scheduledAt)}
                />

                <Detail
                  icon={<UserRound className="h-4 w-4" />}
                  label="Service Provider"
                  value={booking.provider?.name ?? "Not assigned"}
                />

                <Detail
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Total Amount"
                  value={`৳${getAmount(booking.totalAmount)}`}
                />
              </div>

              {booking.provider?.email && (
                <p className="mt-4 break-all text-sm text-muted-foreground">
                  Provider email: {booking.provider.email}
                </p>
              )}

              <div className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                Booking created: {formatDate(booking.createdAt)}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
