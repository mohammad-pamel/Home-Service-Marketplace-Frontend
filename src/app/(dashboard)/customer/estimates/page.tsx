"use client";

import { useState } from "react";
import { RefreshCw, FileText, CalendarDays, Banknote } from "lucide-react";
import Link from "next/link";
import { useGetMyEstimates } from "@/hooks/customer.hook";
import type { Estimate } from "@/types/estimate.type";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  ACCEPTED: "bg-green-100 text-green-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

// function getAmount(estimate: Estimate) {
//   const item = estimate as Estimate & {
//     amount?: number | string;
//     estimatedAmount?: number | string;
//     totalAmount?: number | string;
//   };

//   const amount =
//     item.total ?? item.amount ?? item.subtotal;

//   if (amount === undefined || amount === null || amount === "") {
//     return "Not available";
//   }

//   const parsed = Number(amount);

//   return Number.isFinite(parsed)
//     ? `৳${parsed.toLocaleString("en-BD")}`
//     : String(amount);
// }

function getAmount(estimate: Estimate) {
  const amount = Number(estimate.total);

  return Number.isFinite(amount)
    ? `৳${amount.toLocaleString("en-BD")}`
    : "Not available";
}

export default function CustomerEstimatesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetMyEstimates();

  const [statusFilter, setStatusFilter] = useState("ALL");

  const response = data as { data?: Estimate[] } | undefined;
  const estimates = Array.isArray(response?.data) ? response.data : [];

  const filteredEstimates =
    statusFilter === "ALL"
      ? estimates
      : estimates.filter((estimate) => estimate.status === statusFilter);

  const pendingCount = estimates.filter((estimate) =>
    ["DRAFT", "SENT"].includes(estimate.status),
  ).length;

  const approvedCount = estimates.filter(
    (estimate) => estimate.status === "APPROVED",
  ).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Estimates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and track estimates for your requested services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Estimates"
          value={isLoading ? "..." : estimates.length}
          icon={<FileText size={20} />}
        />
        <SummaryCard
          title="Pending"
          value={isLoading ? "..." : pendingCount}
          icon={<CalendarDays size={20} />}
        />
        <SummaryCard
          title="Approved"
          value={isLoading ? "..." : approvedCount}
          icon={<Banknote size={20} />}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Estimate History</h2>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          aria-label="Filter estimates by status"
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Loading estimates...
        </div>
      ) : isError ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-medium text-red-600">Failed to load estimates.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      ) : filteredEstimates.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <FileText className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-semibold">No estimates found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {statusFilter === "ALL"
              ? "Your service estimates will appear here when available."
              : "There are no estimates with this status."}
          </p>
          {statusFilter === "ALL" && (
            <Link
              href="/services"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredEstimates.map((estimate) => {
            const item = estimate as Estimate & {
              service?: { name?: string };
              serviceRequest?: {
                title?: string;
                service?: { name?: string };
              };
              createdAt?: string;
              updatedAt?: string;
              validUntil?: string;
              notes?: string;
            };

            const serviceName =
              item.service?.name ??
              item.serviceRequest?.service?.name ??
              item.serviceRequest?.title ??
              "Service estimate";

            const status = String(estimate.status ?? "UNKNOWN");

            return (
              <article
                key={estimate.id}
                className="space-y-4 rounded-xl border p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{serviceName}</h3>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      Estimate ID: {estimate.id}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Estimated Amount
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {getAmount(estimate)}
                  </p>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <Detail label="Created" value={formatDate(item.createdAt)} />
                  <Detail
                    label="Last Updated"
                    value={formatDate(item.updatedAt)}
                  />
                  {estimate.expiresAt && (
                    <Detail
                      label="Expires On"
                      value={formatDate(estimate.expiresAt)}
                    />
                  )}
                </div>

                {item.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.notes}
                    </p>
                  </div>
                )}
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
      <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
