
"use client";

import { useMemo, useState } from "react";
import {
  useGetAllProviders,
  useUnverifyProvider,
  useVerifyProvider,
} from "@/hooks/admin.hook";
import type { Provider } from "@/types";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProviderListTable() {
  const { data, isLoading, isError, error } = useGetAllProviders();

  const verifyMutation = useVerifyProvider();
  const unverifyMutation = useUnverifyProvider();

  const isUpdating =
    verifyMutation.isPending || unverifyMutation.isPending;

  const [search, setSearch] = useState("");
  const [verification, setVerification] = useState("ALL");

  const providers: Provider[] = Array.isArray(data?.data)
    ? data.data
    : [];

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesSearch =
        provider.user.name.toLowerCase().includes(query) ||
        provider.user.email.toLowerCase().includes(query) ||
        (provider.serviceArea ?? "").toLowerCase().includes(query);

      const matchesVerification =
        verification === "ALL" ||
        (verification === "VERIFIED" && provider.isVerified) ||
        (verification === "PENDING" && !provider.isVerified);

      return matchesSearch && matchesVerification;
    });
  }, [providers, search, verification]);

  const columns: DataTableColumn<Provider>[] = [
    {
      key: "provider",
      header: "Provider",
      cell: (provider) => (
        <div>
          <p className="font-medium">{provider.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {provider.user.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (provider) => provider.user.phone || "—",
    },
    {
      key: "experience",
      header: "Experience",
      cell: (provider) => `${provider.experienceYears} years`,
    },
    {
      key: "serviceArea",
      header: "Service Area",
      cell: (provider) => provider.serviceArea || "—",
    },
    {
      key: "rating",
      header: "Rating",
      cell: (provider) =>
        `${provider.rating.toFixed(1)} (${provider.totalReviews})`,
    },
    {
      key: "status",
      header: "Status",
      cell: (provider) => (
        <span
          className={
            provider.isVerified
              ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
              : "rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
          }
        >
          {provider.isVerified ? "Verified" : "Not verified"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (provider) =>
        provider.isVerified ? (
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={() => unverifyMutation.mutate(provider.id)}
            className="border-red-200 bg-red-100 text-xs text-red-600 hover:bg-red-200"
          >
            Unverify
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isUpdating}
            onClick={() => verifyMutation.mutate(provider.id)}
            className="text-xs"
          >
            Verify
          </Button>
        ),
    },
  ];

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Failed to load providers:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  return (
    <section className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Provider Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage registered service providers.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredProviders}
        isLoading={isLoading}
        skeletonRows={6}
        emptyTitle="No providers found"
        emptyDescription="No providers match your search or verification filter."
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search name, email, or service area..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full sm:max-w-sm"
            />

            <select
              value={verification}
              onChange={(event) => setVerification(event.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="ALL">All providers</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Not verified</option>
            </select>
          </div>
        }
      />

      <p className="text-sm text-muted-foreground">
        Showing {filteredProviders.length} of {providers.length} providers
      </p>
    </section>
  );
}
