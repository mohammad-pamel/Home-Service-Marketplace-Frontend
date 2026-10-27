
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ClipboardList,
  RefreshCw,
  ArrowRight,
  XCircle,
} from "lucide-react";

import { useGetMyServiceRequests, useCancelMyServiceRequest } from "@/hooks/customer.hook";
import type { ServiceRequest, ServiceRequestStatus } from "@/types/service-request.type";

const statusStyles: Record<ServiceRequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  MATCHED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-indigo-100 text-indigo-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
};

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default function MyRequestsPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetMyServiceRequests();

  const cancelMutation = useCancelMyServiceRequest();
  const [actionError, setActionError] = useState("");

  // Backend returns { success, data, ... }.
  const response = data as { data?: ServiceRequest[] } | undefined;
  const requests = response?.data ?? [];

  async function handleCancel(request: ServiceRequest) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${request.title}"?`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await cancelMutation.mutateAsync(request.id);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to cancel this request.",
      );
    }
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Customer Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            My Service Requests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your requests and check their current status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? "..." : requests.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Requests</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading
              ? "..."
              : requests.filter((request) =>
                  ["PENDING", "MATCHED", "ACCEPTED", "IN_PROGRESS"].includes(
                    request.status,
                  ),
                ).length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading
              ? "..."
              : requests.filter((request) => request.status === "COMPLETED")
                  .length}
          </p>
        </div>
      </section>

      {actionError && (
        <div role="alert" className="rounded-lg border border-red-300 p-4 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          Loading your service requests...
        </div>
      ) : isError ? (
        <div className="space-y-3 rounded-xl border p-8 text-center">
          <p className="text-sm text-red-500">
            Failed to load your service requests.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try Again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border px-5 py-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            No service requests yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our services and submit your first request.
          </p>
          <Link
            href="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Browse Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          {requests.map((request) => {
            const canCancel = ["PENDING", "MATCHED"].includes(request.status);

            return (
              <article
                key={request.id}
                className="rounded-xl border bg-card p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {request.title}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                      >
                        {formatStatus(request.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.service?.name ?? "Service"}
                      {request.service?.category?.name
                        ? ` · ${request.service.category.name}`
                        : ""}
                    </p>
                  </div>

                  <p className="shrink-0 text-xs text-muted-foreground">
                    Created {formatDate(request.createdAt)}
                  </p>
                </div>

                <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm leading-6">
                  {request.description}
                </p>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {request.location?.address ?? "No address provided"}
                      {request.location?.area
                        ? `, ${request.location.area}`
                        : ""}
                      {request.location?.city
                        ? `, ${request.location.city}`
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {formatDate(request.preferredDate)}
                      {request.preferredTime
                        ? ` · ${request.preferredTime}`
                        : ""}
                    </span>
                  </div>
                </div>

                {request.booking && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium">Booking Information</p>
                    <p className="mt-1 text-muted-foreground">
                      Status: {formatStatus(request.booking.status)}
                      {" · "}
                      Scheduled: {formatDate(request.booking.scheduledAt)}
                      {" · "}
                      Amount: ৳{request.booking.totalAmount}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Request ID: {request.id}
                  </p>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(request)}
                      disabled={cancelMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      {cancelMutation.isPending ? "Cancelling..." : "Cancel Request"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
