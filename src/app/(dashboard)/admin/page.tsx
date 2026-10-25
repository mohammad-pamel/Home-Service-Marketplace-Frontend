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
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Loading dashboard overview...</span>
        </div>
      </div>
    );
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
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">Some dashboard data could not load.</p>
            <p className="mt-1 text-muted-foreground">
              Check the failed API requests and admin permissions. The
              other available sections will still be displayed.
            </p>
          </div>
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
