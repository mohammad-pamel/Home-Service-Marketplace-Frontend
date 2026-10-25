
"use client";

import { useMemo, useState } from "react";
import { useGetAllPayments } from "@/hooks/admin.hook";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const paymentStatuses = [
  "ALL",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
] as const;

function formatDate(value?: string | null) {
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

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading payments...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-md border p-6">
        <p className="text-sm text-destructive">
          Failed to load payments. Check your connection or admin access.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
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

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Paid At</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const booking = payment.booking;
                  const customer = booking?.customer;
                  const provider = booking?.provider;
                  const service = booking?.serviceRequest?.service;

                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">
                        {payment.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {customer?.name ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer?.email ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{provider?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider?.email ?? ""}
                        </div>
                      </TableCell>
                      <TableCell>{service?.name ?? "—"}</TableCell>
                      <TableCell>{payment.provider}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatAmount(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.bkashTrxId ??
                          payment.transactionId ??
                          payment.merchantInvoiceNumber ??
                          "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(payment.paidAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredPayments.length} of {payments.length} payments
      </p>
    </div>
  );
}
