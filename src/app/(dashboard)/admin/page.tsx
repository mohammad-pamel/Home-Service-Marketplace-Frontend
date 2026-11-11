"use client";

import {
  useGetAllUsers,
  useGetAllProviders,
  useGetAllCategories,
  useGetAllServices,
  useGetAllServiceRequests,
  useGetAllBookings,
  useGetAllPayments,
} from "@/hooks/admin.hook";

import {
  Users,
  UserRoundCheck,
  Tags,
  BriefcaseBusiness,
  ClipboardList,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Link from "next/link";

function getArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];

  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    if (Array.isArray(response.data)) {
      return response.data as Record<string, unknown>[];
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      Array.isArray(
        (response.data as Record<string, unknown>).data,
      )
    ) {
      return (
        (response.data as Record<string, unknown>)
          .data as Record<string, unknown>[]
      );
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      Array.isArray(
        (response.data as Record<string, unknown>).items,
      )
    ) {
      return (
        (response.data as Record<string, unknown>)
          .items as Record<string, unknown>[]
      );
    }

    if (Array.isArray(response.items)) {
      return response.items as Record<string, unknown>[];
    }
  }

  return [];
}

function formatAmount(value: unknown) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getStatus(item: Record<string, unknown>) {
  return String(item.status ?? "").toUpperCase();
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function StatusItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function formatDate(value: unknown) {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    SUCCESS: "bg-green-100 text-green-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status.replaceAll("_", " ") || "UNKNOWN"}
    </span>
  );
}


function AdminOverviewSkeleton() {
  return (
    <main className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-5 w-48" />
      </section>

      {/* Platform Statistics */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-44" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-11 w-11 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking and Payment Overview */}
      <section className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-5 rounded-xl border bg-card p-5">
            <Skeleton className="h-6 w-40" />

            <div className="space-y-3">
              {Array.from({ length: index === 0 ? 5 : 3 }).map(
                (_, itemIndex) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={itemIndex}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                ),
              )}
            </div>

            {index === 1 && (
              <div className="space-y-3 rounded-lg bg-muted/60 p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-36" />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Analytics */}
      <section className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Revenue Chart */}
        <div className="space-y-5 rounded-xl border bg-card p-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>

        {/* Booking Charts */}
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-5 rounded-xl border bg-card p-5">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Bookings and Payments */}
      <section className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, itemIndex) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={itemIndex}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40 max-w-full" />
                    <Skeleton className="h-3 w-48 max-w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}


export default function AdminOverviewPage() {
  const usersQuery = useGetAllUsers();
  const providersQuery = useGetAllProviders();
  const categoriesQuery = useGetAllCategories();
  const servicesQuery = useGetAllServices();
  const requestsQuery = useGetAllServiceRequests();
  const bookingsQuery = useGetAllBookings();
  const paymentsQuery = useGetAllPayments();

  const queries = [
    usersQuery,
    providersQuery,
    categoriesQuery,
    servicesQuery,
    requestsQuery,
    bookingsQuery,
    paymentsQuery,
  ];

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);

  const users = getArray(usersQuery.data);
  const providers = getArray(providersQuery.data);
  const categories = getArray(categoriesQuery.data);
  const services = getArray(servicesQuery.data);
  const requests = getArray(requestsQuery.data);
  const bookings = getArray(bookingsQuery.data);
  const payments = getArray(paymentsQuery.data);

  const countStatus = (
    items: Record<string, unknown>[],
    statuses: string[],
  ) =>
    items.filter((item) => statuses.includes(getStatus(item))).length;

  const pendingBookings = countStatus(bookings, ["PENDING"]);
  const confirmedBookings = countStatus(bookings, ["CONFIRMED"]);
  const inProgressBookings = countStatus(bookings, ["IN_PROGRESS"]);
  const completedBookings = countStatus(bookings, ["COMPLETED"]);
  const cancelledBookings = countStatus(bookings, ["CANCELLED"]);

  const successfulPayments = countStatus(payments, [
    "SUCCESS",
    "PAID",
    "COMPLETED",
  ]);
  const pendingPayments = countStatus(payments, ["PENDING"]);
  const failedPayments = countStatus(payments, ["FAILED"]);

  const totalRevenue = payments
    .filter((payment) =>
      ["SUCCESS", "PAID", "COMPLETED"].includes(getStatus(payment)),
    )
    .reduce((total, payment) => {
      const amount = Number(payment.amount ?? 0);
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(String(b.createdAt ?? 0)).getTime() -
        new Date(String(a.createdAt ?? 0)).getTime(),
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(String(b.createdAt ?? 0)).getTime() -
        new Date(String(a.createdAt ?? 0)).getTime(),
    )
    .slice(0, 5);

    // Last 6 months analytics
const monthlyAnalytics = Array.from({ length: 6 }, (_, index) => {
  const date = new Date();

  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  date.setMonth(date.getMonth() - (5 - index));

  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    month: date.toLocaleDateString("en-US", { month: "short" }),
    revenue: 0,
    bookings: 0,
  };
});

// Monthly booking counts
bookings.forEach((booking) => {
  const date = new Date(String(booking.createdAt ?? ""));

  if (Number.isNaN(date.getTime())) return;

  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const monthData = monthlyAnalytics.find((item) => item.key === key);

  if (monthData) {
    monthData.bookings += 1;
  }
});

// Monthly successful payment revenue
payments.forEach((payment) => {
  if (!["SUCCESS", "PAID", "COMPLETED"].includes(getStatus(payment))) {
    return;
  }

  const date = new Date(String(payment.createdAt ?? ""));

  if (Number.isNaN(date.getTime())) return;

  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const monthData = monthlyAnalytics.find((item) => item.key === key);

  if (monthData) {
    const amount = Number(payment.amount ?? 0);

    if (Number.isFinite(amount)) {
      monthData.revenue += amount;
    }
  }
});

// Booking status distribution
const bookingStatusData = [
  { name: "Pending", value: pendingBookings, color: "#EAB308" },
  { name: "Confirmed", value: confirmedBookings, color: "#3B82F6" },
  { name: "In Progress", value: inProgressBookings, color: "#6366F1" },
  { name: "Completed", value: completedBookings, color: "#22C55E" },
  { name: "Cancelled", value: cancelledBookings, color: "#EF4444" },
].filter((item) => item.value > 0);

  if (isLoading) {
  return <AdminOverviewSkeleton />;
}

  return (
    <main className="space-y-8 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your Home Service Marketplace at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Live data from your existing APIs
        </div>
      </section>

      
{hasError && (
  <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3 text-sm">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

      <div>
        <p className="font-medium">
          Some dashboard data could not load.
        </p>
        <p className="mt-1 text-muted-foreground">
          One or more API requests failed. Other available dashboard
          sections are still displayed.
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => {
        void Promise.all([
          usersQuery.refetch(),
          providersQuery.refetch(),
          categoriesQuery.refetch(),
          servicesQuery.refetch(),
          requestsQuery.refetch(),
          bookingsQuery.refetch(),
          paymentsQuery.refetch(),
        ]);
      }}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
    >
      <LoaderCircle className="h-4 w-4" />
      Retry All
    </button>
  </div>
)}


      <section>
        <h2 className="mb-4 text-lg font-semibold">Platform Statistics</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            description="Registered users"
            icon={Users}
            href="/admin/all-users"
          />
          <StatCard
            title="Total Providers"
            value={providers.length}
            description="Service provider profiles"
            icon={UserRoundCheck}
            href="/admin/all-providers"
          />
          <StatCard
            title="Total Categories"
            value={categories.length}
            description="Available service categories"
            icon={Tags}
            href="/admin/all-categories"
          />
          <StatCard
            title="Total Services"
            value={services.length}
            description="Listed marketplace services"
            icon={BriefcaseBusiness}
            href="/admin/all-services"
          />
          <StatCard
            title="Service Requests"
            value={requests.length}
            description="Customer service requests"
            icon={ClipboardList}
            href="/admin/all-service-requests"
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            description="All customer bookings"
            icon={CalendarCheck}
            href="/admin/all-bookings"
          />
          <StatCard
            title="Total Payments"
            value={payments.length}
            description="Recorded payment transactions"
            icon={CreditCard}
            href="/admin/all-payments"
          />
          <StatCard
            title="Successful Revenue"
            value={formatAmount(totalRevenue)}
            description="Payments marked successful"
            icon={TrendingUp}
            href="/admin/all-payments"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Booking Overview</h2>
          </div>

          <div className="space-y-3">
            <StatusItem
              label="Pending"
              value={pendingBookings}
              icon={Clock}
            />
            <StatusItem
              label="Confirmed"
              value={confirmedBookings}
              icon={CheckCircle2}
            />
            <StatusItem
              label="In Progress"
              value={inProgressBookings}
              icon={TrendingUp}
            />
            <StatusItem
              label="Completed"
              value={completedBookings}
              icon={CheckCircle2}
            />
            <StatusItem
              label="Cancelled"
              value={cancelledBookings}
              icon={XCircle}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Payment Overview</h2>
          </div>

          <div className="space-y-3">
            <StatusItem
              label="Successful Payments"
              value={successfulPayments}
              icon={CheckCircle2}
            />
            <StatusItem
              label="Pending Payments"
              value={pendingPayments}
              icon={Clock}
            />
            <StatusItem
              label="Failed Payments"
              value={failedPayments}
              icon={XCircle}
            />
            <div className="mt-4 rounded-lg bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">
                Successful Payment Revenue
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatAmount(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
<section className="space-y-5">
  <div>
    <h2 className="text-xl font-bold tracking-tight">
      Platform Analytics
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Monitor revenue, booking trends and platform performance.
    </p>
  </div>

  {/* Revenue Chart */}
  <div className="rounded-xl border bg-card p-5">
    <div className="mb-5">
      <h3 className="font-semibold">Monthly Revenue Trend</h3>
      <p className="text-xs text-muted-foreground">
        Successful payment revenue over the last 6 months
      </p>
    </div>

   
{monthlyAnalytics.some((item) => item.revenue > 0) ? (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={monthlyAnalytics}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [
            formatAmount(value),
            "Revenue",
          ]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16A34A"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
) : (
  <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-lg bg-muted/30">
    <CreditCard className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm font-medium">No revenue data available</p>
    <p className="text-xs text-muted-foreground">
      Successful payments will appear here.
    </p>
  </div>
)}

  </div>

  {/* Booking Trend + Status Chart */}
  <div className="grid gap-6 xl:grid-cols-2">
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-5">
        <h3 className="font-semibold">Monthly Booking Trend</h3>
        <p className="text-xs text-muted-foreground">
          Number of bookings created each month
        </p>
      </div>

      
{monthlyAnalytics.some((item) => item.bookings > 0) ? (
  <div className="h-[280px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyAnalytics}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar
          dataKey="bookings"
          name="Bookings"
          fill="#6366F1"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
) : (
  <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-lg bg-muted/30">
    <CalendarCheck className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm font-medium">No booking data available</p>
    <p className="text-xs text-muted-foreground">
      New bookings will appear here.
    </p>
  </div>
)}

    </div>

    <div className="rounded-xl border bg-card p-5">
      <div className="mb-5">
        <h3 className="font-semibold">Booking Status Distribution</h3>
        <p className="text-xs text-muted-foreground">
          Breakdown of all booking statuses
        </p>
      </div>

      {bookingStatusData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No booking analytics available yet.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {bookingStatusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
</section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Bookings</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest booking activity
              </p>
            </div>
            <Link
              href="/admin/all-bookings"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No booking records found.
            </p>
          ) : (
            <div className="divide-y">
              {recentBookings.map((booking, index) => {
                const customer =
                  booking.customer &&
                  typeof booking.customer === "object"
                    ? (booking.customer as Record<string, unknown>)
                    : {};

                const serviceRequest =
                  booking.serviceRequest &&
                  typeof booking.serviceRequest === "object"
                    ? (booking.serviceRequest as Record<string, unknown>)
                    : {};

                const service =
                  serviceRequest.service &&
                  typeof serviceRequest.service === "object"
                    ? (serviceRequest.service as Record<string, unknown>)
                    : {};

                return (
                  <div
                    key={String(booking.id ?? index)}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {String(service.name ?? "Service booking")}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {String(customer.name ?? "Customer")} ·{" "}
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <StatusBadge status={getStatus(booking)} />
                      <span className="text-sm font-semibold">
                        {formatAmount(booking.totalAmount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Payments</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest payment activity
              </p>
            </div>
            <Link
              href="/admin/all-payments"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No payment records found.
            </p>
          ) : (
            <div className="divide-y">
              {recentPayments.map((payment, index) => {
                const booking =
                  payment.booking && typeof payment.booking === "object"
                    ? (payment.booking as Record<string, unknown>)
                    : {};

                const customer =
                  booking.customer && typeof booking.customer === "object"
                    ? (booking.customer as Record<string, unknown>)
                    : {};

                return (
                  <div
                    key={String(payment.id ?? index)}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {String(customer.name ?? "Customer payment")}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {String(payment.provider ?? "Payment")} ·{" "}
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <StatusBadge status={getStatus(payment)} />
                      <span className="text-sm font-semibold">
                        {formatAmount(payment.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
