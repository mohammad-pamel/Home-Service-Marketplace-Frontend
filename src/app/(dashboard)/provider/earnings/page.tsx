
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMyProviderPayments } from "@/hooks/provider.hook";
import type { Payment } from "@/types/payment.type";
import {
  Search,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownUp,
  CreditCard,
} from "lucide-react";

function formatAmount(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) return "Not paid yet";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusOptions = [
  "ALL",
  "SUCCESS",
  "PENDING",
  "FAILED",
  "CANCELLED",
];

function getStatusStyle(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "FAILED":
    case "CANCELLED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-muted p-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <h2 className="mt-3 text-2xl font-bold">{value}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ProviderEarningsPage() {
  const {
    data: paymentResponse,
    isLoading,
    isError,
    refetch,
  } = useMyProviderPayments();

  const payments: Payment[] = paymentResponse?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS",
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING",
  );

  const failedPayments = payments.filter(
    (payment) =>
      payment.status === "FAILED" ||
      payment.status === "CANCELLED",
  );

  const totalEarnings = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  // Get available payment methods from API data
  const paymentMethods = [
    ...new Set(payments.map((payment) => payment.method)),
  ];

  // Search, filter and sort
  const filteredPayments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const result = payments.filter((payment) => {
      const serviceName =
        payment.booking?.serviceRequest?.service?.name ?? "";

      const customerName = payment.booking?.customer?.name ?? "";

      const matchesSearch =
        !search ||
        serviceName.toLowerCase().includes(search) ||
        customerName.toLowerCase().includes(search) ||
        payment.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );
        case "amount-high":
          return Number(b.amount) - Number(a.amount);
        case "amount-low":
          return Number(a.amount) - Number(b.amount);
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [payments, searchTerm, statusFilter, methodFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading earnings...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">
          Failed to load payment history.
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">My Earnings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your payments and earnings.
        </p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Earnings"
          value={formatAmount(totalEarnings)}
          icon={Wallet}
          description="From successful payments"
        />
        <SummaryCard
          title="Successful Payments"
          value={String(successfulPayments.length)}
          icon={CheckCircle2}
          description="Successfully completed"
        />
        <SummaryCard
          title="Pending Payments"
          value={String(pendingPayments.length)}
          icon={Clock}
          description="Awaiting confirmation"
        />
        <SummaryCard
          title="Failed Payments"
          value={String(failedPayments.length)}
          icon={XCircle}
          description="Failed or cancelled"
        />
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Payment History</h2>
          <p className="text-sm text-muted-foreground">
            Search and filter your payment transactions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search service, customer, payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All Status" : status}
              </option>
            ))}
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">All Methods</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <div className="relative">
            <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredPayments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {payments.length}
            </span>{" "}
            payments
          </p>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <CreditCard className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No payment history available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payments will appear here when customers make payments.
            </p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <Search className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
            <p className="font-medium">No matching payments found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search term or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="whitespace-nowrap p-4">Service</th>
                    <th className="whitespace-nowrap p-4">Customer</th>
                    <th className="whitespace-nowrap p-4">Amount</th>
                    <th className="whitespace-nowrap p-4">Provider</th>
                    <th className="whitespace-nowrap p-4">Method</th>
                    <th className="whitespace-nowrap p-4">Status</th>
                    <th className="whitespace-nowrap p-4">Payment Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-t transition-colors hover:bg-muted/30"
                    >
                      <td className="max-w-[220px] p-4 font-medium">
                        <span className="block truncate">
                          {payment.booking?.serviceRequest?.service?.name ??
                            "Service"}
                        </span>
                      </td>

                      <td className="p-4">
                        {payment.booking?.customer?.name ?? "Customer"}
                      </td>

                      <td className="whitespace-nowrap p-4 font-semibold">
                        {formatAmount(payment.amount)}
                      </td>

                      <td className="p-4">{payment.provider}</td>

                      <td className="p-4">{payment.method}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(payment.status)}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap p-4">
                        {formatDate(payment.paidAt ?? payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
