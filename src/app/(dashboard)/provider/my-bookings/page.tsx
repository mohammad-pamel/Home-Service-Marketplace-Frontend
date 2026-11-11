"use client";

import { useMemo, useState } from "react";
import { useMyBookings } from "@/hooks/provider.hook";
import type { Booking } from "@/types/booking.type";
import {
  Search,
  ClipboardList,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  DollarSign,
  ArrowDownUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SummaryCard from "@/components/shared/summary-card";
import BookingCardSkeleton from "@/components/shared/booking-card-skeleton";

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  IN_PROGRESS:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

type SortOption = "NEWEST" | "OLDEST";

function formatDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProviderMyBookingsPage() {
  const { data, isLoading, isError } = useMyBookings();

  const bookings: Booking[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("NEWEST");

  // Search, Filter and Sorting
  const filteredBookings = useMemo(() => {
    let result = bookings.filter((booking) => {
      const searchText = [
        booking.id,
        booking.serviceRequest?.service?.name,
        booking.customer?.name,
        booking.customer?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.scheduledAt).getTime();
      const dateB = new Date(b.scheduledAt).getTime();

      return sortBy === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [bookings, search, statusFilter, sortBy]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="space-y-3 rounded-xl border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="space-y-4 rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-full lg:w-[200px]" />
            <Skeleton className="h-11 w-full lg:w-[190px]" />
          </div>
          <div className="border-t pt-3">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Booking List Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <BookingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
        <XCircle className="mx-auto mb-2 text-red-500" size={32} />
        <h2 className="font-semibold text-red-600">Failed to load bookings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ClipboardList size={22} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            View and manage your assigned customer bookings.
          </p>
        </div>

        <div className="w-fit rounded-lg border bg-card px-4 py-2">
          <p className="text-xs text-muted-foreground">Total Bookings</p>
          <p className="text-xl font-bold">{bookings.length}</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          title="Total Bookings"
          value={String(bookings.length)}
          icon={ClipboardList}
          description="All assigned bookings"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Pending"
          value={String(bookings.filter((b) => b.status === "PENDING").length)}
          icon={Clock}
          description="Awaiting confirmation"
          isLoading={isLoading}
        />

        <SummaryCard
          title="In Progress"
          value={String(
            bookings.filter((b) => b.status === "IN_PROGRESS").length,
          )}
          icon={ArrowDownUp}
          description="Currently ongoing"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Completed"
          value={String(
            bookings.filter((b) => b.status === "COMPLETED").length,
          )}
          icon={CheckCircle2}
          description="Successfully completed"
          isLoading={isLoading}
        />
      </div>

      {/* Search and Filters */}
      <section className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by service, customer, email or booking ID..."
              className="h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as (typeof statusOptions)[number],
              )
            }
            aria-label="Filter bookings by status"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[200px]"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "ALL"
                  ? "All Statuses"
                  : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          {/* Date Sorting */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            aria-label="Sort bookings by date"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[190px]"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredBookings.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {bookings.length}
            </span>{" "}
            bookings
          </p>

          <p className="text-xs text-muted-foreground">
            Search, filter and sort your bookings
          </p>
        </div>
      </section>

      {/* Booking List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Booking List</h2>
          <p className="text-sm text-muted-foreground">
            Your assigned customer bookings.
          </p>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <ClipboardList size={26} className="text-muted-foreground" />
            </div>

            <h3 className="font-semibold">
              {bookings.length === 0
                ? "No Bookings Found"
                : "No Matching Bookings"}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {bookings.length === 0
                ? "You do not have any assigned bookings yet."
                : "Try changing your search keyword or status filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
              >
                {/* Card Header */}
                <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Service Booking
                    </p>

                    <h3 className="break-words text-lg font-semibold">
                      {booking.serviceRequest?.service?.name ??
                        "Service Booking"}
                    </h3>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      statusStyles[booking.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {booking.status.replaceAll("_", " ")}
                  </span>
                </div>

                {/* Booking Information */}
                <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                  <InfoItem
                    icon={<User size={17} />}
                    label="Customer"
                    value={booking.customer?.name ?? "Not available"}
                  />

                  <InfoItem
                    icon={<Mail size={17} />}
                    label="Customer Email"
                    value={booking.customer?.email ?? "Not available"}
                  />

                  <InfoItem
                    icon={<CalendarDays size={17} />}
                    label="Scheduled Date"
                    value={formatDate(booking.scheduledAt)}
                  />

                  <InfoItem
                    icon={<DollarSign size={17} />}
                    label="Total Amount"
                    value={`৳${Number(booking.totalAmount).toLocaleString()}`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Summary Card
// function SummaryCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border bg-card p-4">
//       <div className="flex items-center justify-between gap-2">
//         <p className="text-xs text-muted-foreground sm:text-sm">
//           {title}
//         </p>

//         <div className="rounded-lg bg-primary/10 p-2 text-primary">
//           {icon}
//         </div>
//       </div>

//       <p className="mt-3 text-2xl font-bold">{value}</p>
//     </div>
//   );
// }

// Booking Information Item
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 shrink-0 rounded-md bg-primary/10 p-2 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>

        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
