
"use client";

import Link from "next/link";
import {
  useMyProviderProfile,
  useMyAssignments,
  useMyBookings,
  useMyWorkLogs,
  useMyProviderPayments,
} from "@/hooks/provider.hook";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

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

function formatAmount(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
}

function buildStatusData(items: { status?: string }[]): StatusItem[] {
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

function StatusPieChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: StatusItem[];
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

      {total === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No data available
          </p>
          <p className="text-xs text-muted-foreground">
            Data will appear here when records are available.
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

                <Tooltip formatter={(value) => [value, "Count"]} />

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

export default function ProviderDashboardPage() {
  const { data: profileResponse, isLoading: profileLoading } =
    useMyProviderProfile();

  const { data: assignmentResponse, isLoading: assignmentLoading } =
    useMyAssignments();

  const { data: bookingResponse, isLoading: bookingLoading } =
    useMyBookings();

  const { data: workLogResponse, isLoading: workLogLoading } =
    useMyWorkLogs();

  const { data: paymentResponse, isLoading: paymentLoading } =
    useMyProviderPayments();

  const profile = profileResponse;
  const assignments = assignmentResponse?.data ?? [];
  const bookings = bookingResponse?.data ?? [];
  const workLogs = workLogResponse?.data ?? [];
  const payments = paymentResponse?.data ?? [];

  const pendingAssignments = assignments.filter(
    (item) => item.status === "PENDING",
  );

  const activeWorkLogs = workLogs.filter(
    (item) => !item.completedAt,
  );

  const successfulPayments = payments.filter(
    (item) => item.status === "SUCCESS",
  );

  const totalEarnings = successfulPayments.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const isLoading =
    profileLoading ||
    assignmentLoading ||
    bookingLoading ||
    workLogLoading ||
    paymentLoading;

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      href: "/provider/my-bookings",
    },
    {
      title: "Pending Assignments",
      value: pendingAssignments.length,
      href: "/provider/my-assignments",
    },
    {
      title: "Active Work Logs",
      value: activeWorkLogs.length,
      href: "/provider/work-logs",
    },
    {
      title: "Total Earnings",
      value: formatAmount(totalEarnings),
      href: "/provider/earnings",
    },
  ];

  const bookingStatusData = buildStatusData(bookings);
  const assignmentStatusData = buildStatusData(assignments);

  const workLogStatusData = buildStatusData(
    workLogs.map((item) => ({
      status: item.completedAt ? "COMPLETED" : "IN_PROGRESS",
    })),
  );

  const paymentStatusData = buildStatusData(payments);

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {profile?.user?.name ?? "Provider"}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is an overview of your service business.
        </p>
      </div>

      {/* Profile Status */}
      <div className="rounded-lg border p-5">
        <h2 className="font-semibold">Provider Profile</h2>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span>
            Verification: {profile?.isVerified ? "Verified" : "Not Verified"}
          </span>
          <span>Rating: {profile?.rating ?? 0} / 5</span>
          <span>Total Reviews: {profile?.totalReviews ?? 0}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="rounded-lg border p-5 transition hover:bg-muted/50"
          >
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <h2 className="mt-2 text-2xl font-bold">{stat.value}</h2>
          </Link>
        ))}
      </div>

      {/* Analytics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Business Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your bookings, assignments, work logs, and payments.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <StatusPieChart
            title="Booking Status"
            description="Your booking distribution"
            data={bookingStatusData}
          />

          <StatusPieChart
            title="Assignment Status"
            description="Your assignment distribution"
            data={assignmentStatusData}
          />

          <StatusPieChart
            title="Work Log Status"
            description="Completed and ongoing work logs"
            data={workLogStatusData}
          />

          <StatusPieChart
            title="Payment Status"
            description="Your payment record distribution"
            data={paymentStatusData}
          />
        </div>
      </section>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link
            href="/provider/my-bookings"
            className="text-sm underline"
          >
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="rounded-lg border p-5 text-sm text-muted-foreground">
            No bookings available yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="p-4">
                      {booking.serviceRequest?.service?.name ?? "Service"}
                    </td>
                    <td className="p-4">
                      {booking.customer?.name ?? "Customer"}
                    </td>
                    <td className="p-4">
                      {formatAmount(booking.totalAmount)}
                    </td>
                    <td className="p-4">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
