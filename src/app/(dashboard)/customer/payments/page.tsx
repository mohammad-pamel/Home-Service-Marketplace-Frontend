"use client";

import { useState } from "react";
import { RefreshCw, CreditCard, CheckCircle2, Clock3 } from "lucide-react";
import { useGetMyPayments } from "@/hooks/customer.hook";
import type { Payment } from "@/types/payment.type";

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function formatAmount(value: number | string | undefined) {
  if (value === undefined || value === "") return "—";

  const amount = Number(value);

  return Number.isFinite(amount)
    ? `৳${amount.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : String(value);
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  SUCCESS: "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-purple-100 text-purple-700",
};

export default function CustomerPaymentsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetMyPayments();

  const [statusFilter, setStatusFilter] = useState("ALL");

  const response = data as { data?: Payment[] } | undefined;
  const payments = Array.isArray(response?.data) ? response.data : [];

  const filteredPayments =
    statusFilter === "ALL"
      ? payments
      : payments.filter(
          (payment) => payment.status === statusFilter,
        );

  const paidStatuses = ["PAID", "SUCCESS", "COMPLETED"];

  const successfulCount = payments.filter((payment) =>
    paidStatuses.includes(payment.status),
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "PENDING",
  ).length;

//   const totalPaid = payments.reduce((sum, payment) => {
//     if (!paidStatuses.includes(payment.status)) return sum;
//     return sum + Number(payment.amount || 0);
//   }, 0);

const totalPaid = payments.reduce((sum, payment) => {
  if (payment.status !== "SUCCESS") return sum;

  return sum + Number(payment.amount || 0);
}, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your service payments and transaction statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Paid"
          value={isLoading ? "..." : formatAmount(totalPaid)}
          icon={<CreditCard size={20} />}
        />
        <SummaryCard
          title="Successful Payments"
          value={isLoading ? "..." : successfulCount}
          icon={<CheckCircle2 size={20} />}
        />
        <SummaryCard
          title="Pending Payments"
          value={isLoading ? "..." : pendingCount}
          icon={<Clock3 size={20} />}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Transactions</h2>

        <select
          aria-label="Filter payments by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="ALL">All statuses</option>
          {[...new Set(payments.map((payment) => payment.status))].map(
            (status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ),
          )}
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Loading payment history...
        </div>
      ) : isError ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-medium text-red-600">
            Failed to load payments.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <CreditCard
            size={36}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <h3 className="font-semibold">No payments found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {statusFilter === "ALL"
              ? "Your transactions will appear here when available."
              : "No transactions match this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const item = payment as Payment & {
              method?: string;
              provider?: string;
              bkashTrxId?: string | null;
              merchantInvoiceNumber?: string | null;
              paidAt?: string | null;
              createdAt?: string;
              booking?: {
                id?: string;
                serviceRequest?: {
                  service?: { name?: string };
                };
              };
            };

            const status = String(payment.status);
            const transactionId =
  payment.transactionId ??
  payment.bkashTrxId ??
  payment.merchantInvoiceNumber ??
  payment.id;

            return (
              <article
                key={payment.id}
                className="rounded-xl border p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <CreditCard size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {item.booking?.serviceRequest?.service?.name ??
                          "Service Payment"}
                      </h3>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        Transaction: {transactionId}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Booking: {item.booking?.id ?? payment.bookingId}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xl font-bold">
                      {formatAmount(payment.amount)}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">
                  <Detail
                    label="Payment Method"
                    value={item.method ?? "—"}
                  />
                  <Detail
                    label="Payment Provider"
                    value={item.provider ?? "—"}
                  />
                  <Detail
                    label="Payment Date"
                    value={formatDate(item.paidAt ?? item.createdAt)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
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
    <div className="flex items-center justify-between rounded-xl border p-5">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
      <div className="rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  );
}
