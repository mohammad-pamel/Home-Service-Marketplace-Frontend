
"use client";

import { useMemo, useState } from "react";
import { useGetAllProviders, useUnverifyProvider, useVerifyProvider } from "@/hooks/admin.hook";
import type { Provider } from "@/types";
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

  if (isLoading) {
    return <p className="p-6">Loading providers...</p>;
  }

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search name, email, or service area..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Service Area</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredProviders.map((provider) => (
                <tr key={provider.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{provider.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.user.email}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    {provider.user.phone || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {provider.experienceYears} years
                  </td>

                  <td className="px-4 py-3">
                    {provider.serviceArea || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {provider.rating.toFixed(1)} ({provider.totalReviews})
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        provider.isVerified
                          ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
                      }
                    >
                      {provider.isVerified ? "Verified" : "Not verified"}
                    </span>
                  </td>
                  
<td className="px-4 py-3">
  {provider.isVerified ? (
    <Button
      type="button"
      disabled={isUpdating}
      onClick={() => unverifyMutation.mutate(provider.id)}
      className="rounded-md border px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-400"
    >
      Unverify
    </Button>
  ) : (
    <Button
      type="button"
      disabled={isUpdating}
      onClick={() => verifyMutation.mutate(provider.id)}
      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
    >
      Verify
    </Button>
  )}
</td>

                </tr>
              ))}

              {filteredProviders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredProviders.length} of {providers.length} providers
      </p>
    </section>
  );
}
