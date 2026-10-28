"use client";

import Link from "next/link";
import {
  ClipboardList,
  CalendarCheck,
  FileText,
  CreditCard,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import {
  useGetMyServiceRequests,
  useGetMyBookings,
  useGetMyEstimates,
  useGetMyPayments,
} from "@/hooks/customer.hook";

function getArray<T>(response: unknown): T[] {
  if (!response || typeof response !== "object") return [];

  const result = response as {
    data?: unknown;
  };

  if (Array.isArray(result.data)) return result.data as T[];

  return [];
}

function SummaryCard({
  title,
  value,
  description,
  href,
  icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  href: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border p-5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">
            {loading ? "..." : value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
        View details
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

export default function CustomerDashboardPage() {
  const requestsQuery = useGetMyServiceRequests();
  const bookingsQuery = useGetMyBookings();
  const estimatesQuery = useGetMyEstimates();
  const paymentsQuery = useGetMyPayments();

  const requests = getArray<{ id: string }>(requestsQuery.data);
  const bookings = getArray<{
    id: string;
    status: string;
  }>(bookingsQuery.data);
  const estimates = getArray<{
    id: string;
    status: string;
  }>(estimatesQuery.data);
  const payments = getArray<{
    id: string;
    status: string;
  }>(paymentsQuery.data);

  const loading =
    requestsQuery.isLoading ||
    bookingsQuery.isLoading ||
    estimatesQuery.isLoading ||
    paymentsQuery.isLoading;

  const hasError =
    requestsQuery.isError ||
    bookingsQuery.isError ||
    estimatesQuery.isError ||
    paymentsQuery.isError;

  async function refreshDashboard() {
    await Promise.all([
      requestsQuery.refetch(),
      bookingsQuery.refetch(),
      estimatesQuery.refetch(),
      paymentsQuery.refetch(),
    ]);
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your service requests, bookings, estimates, and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {hasError && (
        <div className="rounded-lg border border-red-200 p-4 text-sm text-red-600">
          Some dashboard information could not be loaded. Check the relevant
          page or refresh the dashboard.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="My Requests"
          value={requests.length}
          description="Your service requests"
          href="/customer/my-requests"
          icon={<ClipboardList size={22} />}
          loading={requestsQuery.isLoading}
        />

        <SummaryCard
          title="My Bookings"
          value={bookings.length}
          description="Your service bookings"
          href="/customer/my-bookings"
          icon={<CalendarCheck size={22} />}
          loading={bookingsQuery.isLoading}
        />

        <SummaryCard
          title="My Estimates"
          value={estimates.length}
          description="Your service estimates"
          href="/customer/estimates"
          icon={<FileText size={22} />}
          loading={estimatesQuery.isLoading}
        />

        <SummaryCard
          title="Payments"
          value={payments.length}
          description="Your payment records"
          href="/customer/payments"
          icon={<CreditCard size={22} />}
          loading={paymentsQuery.isLoading}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/services"
            className="flex items-center justify-between gap-3 rounded-xl border p-5 hover:bg-muted/50"
          >
            <div>
              <h3 className="font-semibold">Browse Services</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Find a service that matches your needs.
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/customer/my-requests"
            className="flex items-center justify-between gap-3 rounded-xl border p-5 hover:bg-muted/50"
          >
            <div>
              <h3 className="font-semibold">Track Requests</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Check the latest status of your requests.
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/customer/my-bookings"
            className="flex items-center justify-between gap-3 rounded-xl border p-5 hover:bg-muted/50"
          >
            <div>
              <h3 className="font-semibold">View Bookings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your scheduled services.
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/customer/profile"
            className="flex items-center justify-between gap-3 rounded-xl border p-5 hover:bg-muted/50"
          >
            <div>
              <h3 className="font-semibold">Update Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep your personal information current.
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
