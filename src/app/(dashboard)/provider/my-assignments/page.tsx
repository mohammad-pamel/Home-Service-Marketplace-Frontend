"use client";

import { useMemo, useState } from "react";
import {
  useMyAssignments,
  useUpdateMyAssignmentStatus,
} from "@/hooks/provider.hook";
import { toast } from "@/components/ui/toast";
import {
  Search,
  X,
  ClipboardList,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";

type AssignmentStatus = "ACCEPTED" | "REJECTED";

const statusOptions = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "REJECTED",
] as const;

function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";
    case "ACCEPTED":
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyAssignmentsPage() {
  const assignmentsQuery = useMyAssignments();
  const statusMutation = useUpdateMyAssignmentStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("ALL");

  const assignments = assignmentsQuery.data?.data ?? [];

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const request = assignment.serviceRequest;

      const searchText = [
        request?.title,
        request?.service?.name,
        request?.customer?.name,
        request?.customer?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase(),
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        assignment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assignments, search, statusFilter]);

  function handleStatusUpdate(
    assignmentId: string,
    status: AssignmentStatus,
  ) {
    statusMutation.mutate(
      { assignmentId, status },
      {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description:
              status === "ACCEPTED"
                ? "Assignment accepted successfully."
                : "Assignment rejected successfully.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Request failed",
            description: error.message || "Please try again.",
            type: "error",
          });
        },
      },
    );
  }

  if (assignmentsQuery.isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium">
            Loading assignments...
          </span>
        </div>
      </div>
    );
  }

  if (assignmentsQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
        <XCircle className="mx-auto mb-2 text-red-500" size={32} />
        <h2 className="font-semibold text-red-600">
          Failed to load assignments
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ClipboardList size={22} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Assignments
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage service requests assigned to you.
          </p>
        </div>

        <div className="w-fit rounded-lg border bg-card px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Total Assignments
          </p>
          <p className="text-xl font-bold">
            {assignments.length}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Pending
            </p>
            <Clock size={18} className="text-yellow-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {assignments.filter((a) => a.status === "PENDING").length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Accepted
            </p>
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {assignments.filter((a) => a.status === "ACCEPTED").length}
          </p>
        </div>

        <div className="col-span-2 rounded-xl border bg-card p-4 sm:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Rejected
            </p>
            <XCircle size={18} className="text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {assignments.filter((a) => a.status === "REJECTED").length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative w-full flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by title, service, customer or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as (typeof statusOptions)[number],
              )
            }
            aria-label="Filter assignments by status"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary md:w-[200px]"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "ALL"
                  ? "All Statuses"
                  : status.charAt(0) +
                    status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-muted md:w-auto"
          >
            <X size={16} />
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredAssignments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {assignments.length}
            </span>{" "}
            assignments
          </p>
          <p className="text-xs text-muted-foreground">
            Search and filter your assignments
          </p>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-xl border bg-card px-4 py-12 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <ClipboardList
              size={26}
              className="text-muted-foreground"
            />
          </div>

          <h2 className="font-semibold">
            {assignments.length === 0
              ? "No Assignments Yet"
              : "No Matching Assignments"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {assignments.length === 0
              ? "You do not have any assigned service requests yet."
              : "Try changing your search keyword or status filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredAssignments.map((assignment) => {
            const request = assignment.serviceRequest;

            return (
              <article
                key={assignment.id}
                className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
              >
                {/* Card Header */}
                <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Service Request
                    </p>
                    <h2 className="break-words text-lg font-semibold">
                      {request?.title ?? "Service Request"}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Assignment ID: {assignment.id}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(assignment.status)}`}
                  >
                    {assignment.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="space-y-5 p-4 sm:p-5">
                  {/* Information Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                      icon={<BriefcaseBusiness size={17} />}
                      label="Service"
                      value={request?.service?.name ?? "Not available"}
                    />

                    <InfoItem
                      icon={<User size={17} />}
                      label="Customer"
                      value={request?.customer?.name ?? "Not available"}
                    />

                    <InfoItem
                      icon={<Mail size={17} />}
                      label="Customer Email"
                      value={request?.customer?.email ?? "Not available"}
                    />

                    <InfoItem
                      icon={<Phone size={17} />}
                      label="Phone"
                      value={request?.customer?.phone ?? "Not provided"}
                    />

                    <InfoItem
                      icon={<MapPin size={17} />}
                      label="Location"
                      value={[
                        request?.location?.address,
                        request?.location?.area,
                        request?.location?.city,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Not available"}
                    />

                    <InfoItem
                      icon={<CalendarDays size={17} />}
                      label="Preferred Date"
                      value={formatDate(request?.preferredDate)}
                    />
                  </div>

                  {/* Description */}
                  <div className="rounded-lg bg-muted/40 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText
                        size={17}
                        className="text-primary"
                      />
                      <p className="text-sm font-semibold">
                        Description
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                      {request?.description ??
                        "No description available."}
                    </p>
                  </div>

                  {/* Actions */}
                  {assignment.status === "PENDING" && (
                    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          handleStatusUpdate(
                            assignment.id,
                            "REJECTED",
                          )
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-md border border-red-500/40 px-5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30 sm:w-auto"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          handleStatusUpdate(
                            assignment.id,
                            "ACCEPTED",
                          )
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        <CheckCircle2 size={17} />
                        Accept Assignment
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 shrink-0 rounded-md bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}
