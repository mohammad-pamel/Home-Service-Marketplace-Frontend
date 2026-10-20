
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetAllServiceRequests } from "@/hooks/admin.hook";
import { Button } from "@/components/ui/button";

// export function generateStaticParams() {
//   return [];
// }

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="break-words font-medium">{value ?? "Not available"}</p>
    </div>
  );
}

export default function ServiceRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllServiceRequests();

  const request = data?.data?.find((item) => item.id === params.id);

  async function copyRequestId() {
    try {
      await navigator.clipboard.writeText(params.id);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading request details...</div>;
  }

  if (isError) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-500">
          Failed to load service request details.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-xl font-semibold">Request Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This request could not be found in the service request list.
        </p>
        <Button onClick={() => router.push("/admin/service-requests")}>
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header and Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Request Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View customer, service, assignment and booking information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/all-service-requests")}
          >
            Back to Requests
          </Button>

          <Button variant="outline" onClick={copyRequestId}>
            {copied ? "ID Copied" : "Copy Request ID"}
          </Button>

          <Button
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Request Information */}
      <section className="rounded-lg border p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Request Information</h2>
          <span className="rounded-md border px-3 py-1 text-sm font-medium">
            {request.status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Request Title" value={request.title} />
          <Detail label="Request ID" value={request.id} />
          <Detail label="Created At" value={formatDate(request.createdAt)} />
          <Detail
            label="Preferred Date"
            value={formatDate(request.preferredDate)}
          />
          <Detail label="Preferred Time" value={request.preferredTime} />
          <Detail label="Last Updated" value={formatDate(request.updatedAt)} />
        </div>

        <div className="mt-5 border-t pt-4">
          <p className="mb-2 text-sm text-muted-foreground">Description</p>
          <p className="whitespace-pre-wrap leading-7">
            {request.description}
          </p>
        </div>
      </section>

      {/* Customer Information */}
      <section className="rounded-lg border p-5">
        <h2 className="mb-5 text-lg font-semibold">Customer Information</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Name" value={request.customer.name} />
          <Detail label="Email" value={request.customer.email} />
          <Detail label="Phone" value={request.customer.phone} />
          <Detail label="Customer ID" value={request.customer.id} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" >
            <a href={`mailto:${request.customer.email}`}>
              Email Customer
            </a>
          </Button>

          {request.customer.phone && (
            <Button variant="outline">
              <a href={`tel:${request.customer.phone}`}>
                Call Customer
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Service Information */}
      <section className="rounded-lg border p-5">
        <h2 className="mb-5 text-lg font-semibold">Service Information</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Service" value={request.service.name} />
          <Detail
            label="Category"
            value={request.service.category.name}
          />
          <Detail label="Service ID" value={request.service.id} />
        </div>
      </section>

      {/* Location Information */}
      <section className="rounded-lg border p-5">
        <h2 className="mb-5 text-lg font-semibold">Location Information</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Address" value={request.location.address} />
          <Detail label="Area" value={request.location.area} />
          <Detail label="City" value={request.location.city} />
          <Detail label="Latitude" value={request.location.latitude} />
          <Detail label="Longitude" value={request.location.longitude} />
        </div>

        {request.location.latitude != null &&
          request.location.longitude != null && (
            <div className="mt-4">
              <Button variant="outline">
                <a
                  href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Location in Maps
                </a>
              </Button>
            </div>
          )}
      </section>

      {/* Provider Assignments */}
      <section className="rounded-lg border p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Provider Assignments</h2>
          <span className="text-sm text-muted-foreground">
            {request.assignments.length} assignment(s)
          </span>
        </div>

        {request.assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No provider has been assigned yet.
          </p>
        ) : (
          <div className="space-y-4">
            {request.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-md border p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail
                    label="Provider Name"
                    value={assignment.provider.name}
                  />
                  <Detail
                    label="Provider Email"
                    value={assignment.provider.email}
                  />
                  <Detail
                    label="Provider Phone"
                    value={assignment.provider.phone}
                  />
                  <Detail
                    label="Assignment Status"
                    value={assignment.status}
                  />
                  <Detail
                    label="Assigned At"
                    value={formatDate(assignment.assignedAt)}
                  />
                  <Detail
                    label="Responded At"
                    value={formatDate(assignment.respondedAt)}
                  />
                </div>

                <div className="mt-4">
                  <Button variant="outline" >
                    <a href={`mailto:${assignment.provider.email}`}>
                      Contact Provider
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Information */}
      <section className="rounded-lg border p-5">
        <h2 className="mb-5 text-lg font-semibold">Booking Information</h2>

        {!request.booking ? (
          <p className="text-sm text-muted-foreground">
            No booking has been created for this request.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Booking ID" value={request.booking.id} />
              <Detail label="Booking Status" value={request.booking.status} />
              <Detail
                label="Total Amount"
                value={`৳${request.booking.totalAmount}`}
              />
              <Detail
                label="Scheduled At"
                value={formatDate(request.booking.scheduledAt)}
              />
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard
                    .writeText(request.booking!.id)
                    .catch(() => {})
                }
              >
                Copy Booking ID
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Bottom Action */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/all-service-requests")}
        >
          Back to All Requests
        </Button>

        <Button variant="outline" >
          <Link href="/admin/all-providers">Manage Providers</Link>
        </Button>
      </div>
    </div>
  );
}
