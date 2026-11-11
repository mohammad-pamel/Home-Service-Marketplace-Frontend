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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import {
  useGetMyServiceRequests,
  useGetMyBookings,
  useGetMyEstimates,
  useGetMyPayments,
} from "@/hooks/customer.hook";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

type StatusItem = {
  name: string;
  value: number;
};

function getArray<T>(response: unknown): T[] {
  if (!response || typeof response !== "object") return [];

  const result = response as {
    data?: unknown;
  };

  if (Array.isArray(result.data)) return result.data as T[];

  return [];
}

function buildStatusData(
  items: { status?: string }[],
): StatusItem[] {
  const statusCounts: Record<string, number> = {};

  items.forEach((item) => {
    const status = item.status?.trim() || "Unknown";

    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));
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

function StatusPieChart({
  title,
  description,
  data,
  loading,
}: {
  title: string;
  description: string;
  data: StatusItem[];
  loading: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border p-5">
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      {loading ? (
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading chart...
          </p>
        </div>
      ) : total === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No data available
          </p>
          <p className="text-xs text-muted-foreground">
            Data will appear here when you have records.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [value, "Count"]}
                />

                <Legend
                  verticalAlign="bottom"
                  height={45}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 border-t pt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Total Records
            </p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </>
      )}
    </div>
  );
}


function CustomerDashboardSkeleton() {
  return (
    <main className="space-y-8 p-4 md:p-6">
      {/* Dashboard Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-11 w-11 rounded-lg" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </section>

      {/* Analytics Heading */}
      <section className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Analytics Charts */}
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-4 rounded-xl border bg-card p-5">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>

              <div className="flex h-[260px] items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>

              <div className="flex justify-center gap-4">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <Skeleton
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={itemIndex}
                    className="h-3 w-16"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-32" />

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="flex items-center justify-between gap-3 rounded-xl border p-5"
            >
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-56 max-w-full" />
              </div>
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


export default function CustomerDashboardPage() {
  const requestsQuery = useGetMyServiceRequests();
  const bookingsQuery = useGetMyBookings();
  const estimatesQuery = useGetMyEstimates();
  const paymentsQuery = useGetMyPayments();

  const requests = getArray<{
    id: string;
    status?: string;
  }>(requestsQuery.data);

  const bookings = getArray<{
    id: string;
    status?: string;
  }>(bookingsQuery.data);

  const estimates = getArray<{
    id: string;
    status?: string;
  }>(estimatesQuery.data);

  const payments = getArray<{
    id: string;
    status?: string;
  }>(paymentsQuery.data);

  const loading =
    requestsQuery.isLoading ||
    bookingsQuery.isLoading ||
    estimatesQuery.isLoading ||
    paymentsQuery.isLoading;

  if (loading) {
  return <CustomerDashboardSkeleton />;
}

  const requestStatusData = buildStatusData(requests);
  const bookingStatusData = buildStatusData(bookings);
  const estimateStatusData = buildStatusData(estimates);
  const paymentStatusData = buildStatusData(payments);

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
      {/* Dashboard Header */}
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
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {/* {hasError && (
        <div className="rounded-lg border border-red-200 p-4 text-sm text-red-600">
          Some dashboard information could not be loaded. Check the relevant
          page or refresh the dashboard.
        </div>
      )} */}

      {/* Summary Cards */}
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

      {/* Analytics Charts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            My Activity Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your requests, bookings, estimates, and payments.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <StatusPieChart
            title="Service Request Status"
            description="Your service request distribution"
            data={requestStatusData}
            loading={requestsQuery.isLoading}
          />

          <StatusPieChart
            title="Booking Status"
            description="Your booking distribution"
            data={bookingStatusData}
            loading={bookingsQuery.isLoading}
          />

          <StatusPieChart
            title="Estimate Status"
            description="Your estimate distribution"
            data={estimateStatusData}
            loading={estimatesQuery.isLoading}
          />

          <StatusPieChart
            title="Payment Status"
            description="Your payment record distribution"
            data={paymentStatusData}
            loading={paymentsQuery.isLoading}
          />
        </div>
      </section>

      {/* Quick Actions */}
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