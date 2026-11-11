"use client";

import { useMemo, useState } from "react";
import { useGetAllEstimates } from "@/hooks/admin.hook";
import type { Estimate } from "@/types";
import { Input } from "@/components/ui/input";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

const formatAmount = (value: number | string) =>
  Number(value).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString();
}

export function EstimateListTable() {
  const { data, isLoading, isError, refetch } = useGetAllEstimates();

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
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(keyword),
      );

      const matchesStatus =
        statusFilter === "ALL" || estimate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [estimates, search, statusFilter]);

  const columns: DataTableColumn<Estimate>[] = [
    {
      key: "service",
      header: "Service",
      cell: (estimate) =>
        estimate.booking?.serviceRequest?.service?.name ?? "—",
    },
    {
      key: "customer",
      header: "Customer",
      cell: (estimate) => (
        <div>
          <p className="font-medium">
            {estimate.booking?.customer?.name ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {estimate.booking?.customer?.email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (estimate) => (
        <div>
          <p>{estimate.booking?.provider?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {estimate.booking?.provider?.email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (estimate) => estimate.items?.length ?? 0,
    },
    {
      key: "subtotal",
      header: "Subtotal",
      cell: (estimate) => `৳${formatAmount(estimate.subtotal)}`,
    },
    {
      key: "tax",
      header: "Tax",
      cell: (estimate) => `৳${formatAmount(estimate.tax)}`,
    },
    {
      key: "discount",
      header: "Discount",
      cell: (estimate) => `৳${formatAmount(estimate.discount)}`,
    },
    {
      key: "total",
      header: "Total",
      cell: (estimate) => (
        <span className="whitespace-nowrap font-medium">
          ৳{formatAmount(estimate.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (estimate) => (
        <span className="rounded-full border px-2 py-1 text-xs">
          {estimate.status}
        </span>
      ),
    },
    {
      key: "expiresAt",
      header: "Expires",
      cell: (estimate) => (
        <span className="whitespace-nowrap">
          {formatDate(estimate.expiresAt)}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-3 rounded-md border p-6">
        <p className="text-sm text-destructive">
          Failed to load estimates. Please try again.
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
      <DataTable
        columns={columns}
        data={filteredEstimates}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No estimates found"
        emptyDescription="No estimates match your search or selected status."
        caption={`Showing ${filteredEstimates.length} of ${estimates.length} estimates`}
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row">
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
        }
      />
    </div>
  );
}
