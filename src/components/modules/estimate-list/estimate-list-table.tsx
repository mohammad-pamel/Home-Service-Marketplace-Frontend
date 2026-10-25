
"use client";

import { useMemo, useState } from "react";
import { useGetAllEstimates } from "@/hooks/admin.hook";
import type { Estimate } from "@/types";
import { Input } from "@/components/ui/input";

const formatAmount = (value: number | string) =>
  Number(value).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function EstimateListTable() {
  const { data, isLoading, isError } = useGetAllEstimates();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const estimates: Estimate[] = data?.data ?? [];

  const filteredEstimates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return estimates.filter((estimate) => {
      const customer = estimate.booking?.customer;
      const provider = estimate.booking?.provider;
      const service = estimate.booking?.serviceRequest?.service?.name;

      const matchesSearch = [
        estimate.id,
        estimate.bookingId,
        customer?.name,
        customer?.email,
        provider?.name,
        provider?.email,
        service,
      ]
        .some((value) => value?.toLowerCase().includes(keyword));

      const matchesStatus =
        statusFilter === "ALL" || estimate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [estimates, search, statusFilter]);

  if (isLoading) {
    return <p className="p-4">Loading estimates...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Failed to load estimates. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search customer, provider, service..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-sm"
        />

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
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

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">Service</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Items</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">Tax</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Expires</th>
            </tr>
          </thead>

          <tbody>
            {filteredEstimates.map((estimate) => (
              <tr key={estimate.id} className="border-t">
                <td className="p-3">
                  {estimate.booking?.serviceRequest?.service?.name ?? "—"}
                </td>
                <td className="p-3">
                  <div>{estimate.booking?.customer?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {estimate.booking?.customer?.email}
                  </div>
                </td>
                <td className="p-3">
                  <div>{estimate.booking?.provider?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {estimate.booking?.provider?.email}
                  </div>
                </td>
                <td className="p-3">{estimate.items?.length ?? 0}</td>
                <td className="p-3">{formatAmount(estimate.subtotal)}</td>
                <td className="p-3">{formatAmount(estimate.tax)}</td>
                <td className="p-3">{formatAmount(estimate.discount)}</td>
                <td className="p-3 font-medium">
                  {formatAmount(estimate.total)}
                </td>
                <td className="p-3">{estimate.status}</td>
                <td className="p-3">
                  {estimate.expiresAt
                    ? new Date(estimate.expiresAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}

            {filteredEstimates.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-muted-foreground">
                  No estimates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredEstimates.length} of {estimates.length} estimates
      </p>
    </div>
  );
}
