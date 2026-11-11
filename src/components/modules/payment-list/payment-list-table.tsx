"use client";

import { useMemo, useState } from "react";
import { useGetAllPayments } from "@/hooks/admin.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

const paymentStatuses = [
  "ALL",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
] as const;

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function formatAmount(value?: number | string | null) {
  if (value === undefined || value === null) return "—";

  return `৳${Number(value).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PaymentListTable() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllPayments();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof paymentStatuses)[number]>("ALL");

  const payments = data?.data ?? [];

  const filteredPayments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const booking = payment.booking;
      const customer = booking?.customer;
      const provider = booking?.provider;
      const service = booking?.serviceRequest?.service;

      const matchesSearch = [
        payment.id,
        payment.bkashTrxId,
        payment.transactionId,
        payment.merchantInvoiceNumber,
        customer?.name,
        customer?.email,
        provider?.name,
        provider?.email,
        service?.name,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchTerm),
      );

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const columns: DataTableColumn<(typeof payments)[number]>[] = [
    {
      key: "paymentId",
      header: "Payment ID",
      cell: (payment) => (
        <span className="font-mono text-xs">
          {payment.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (payment) => (
        <div>
          <p className="font-medium">
            {payment.booking?.customer?.name ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {payment.booking?.customer?.email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (payment) => (
        <div>
          <p>{payment.booking?.provider?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {payment.booking?.provider?.email ?? ""}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (payment) =>
        payment.booking?.serviceRequest?.service?.name ?? "—",
    },
    {
      key: "gateway",
      header: "Gateway",
      cell: (payment) => payment.provider,
    },
    {
      key: "method",
      header: "Method",
      cell: (payment) => payment.method,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (payment) => (
        <span className="whitespace-nowrap font-medium">
          {formatAmount(payment.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (payment) => (
        <span className="rounded-full border px-2 py-1 text-xs">
          {payment.status}
        </span>
      ),
    },
    {
      key: "transactionId",
      header: "Transaction ID",
      cell: (payment) => (
        <span className="font-mono text-xs">
          {payment.bkashTrxId ??
            payment.transactionId ??
            payment.merchantInvoiceNumber ??
            "—"}
        </span>
      ),
    },
    {
      key: "paidAt",
      header: "Paid At",
      cell: (payment) => (
        <span className="whitespace-nowrap">
          {formatDate(payment.paidAt)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (payment) => (
        <span className="whitespace-nowrap">
          {formatDate(payment.createdAt)}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-3 rounded-md border p-6">
        <p className="text-sm text-destructive">
          Failed to load payments. Check your connection or admin access.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredPayments}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No payments found"
        emptyDescription="No payments match your search or selected status."
        caption={`Showing ${filteredPayments.length} of ${payments.length} payments`}
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search customer, provider, service or transaction..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-md"
            />

            <select
              aria-label="Filter payments by status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as (typeof paymentStatuses)[number],
                )
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : status}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        }
      />
    </div>
  );
}
