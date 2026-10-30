
"use client";

import {
  useMyAssignments,
  useUpdateMyAssignmentStatus,
} from "@/hooks/provider.hook";
import { toast } from "@/components/ui/toast";

export default function MyAssignmentsPage() {
  const assignmentsQuery = useMyAssignments();
  const statusMutation = useUpdateMyAssignmentStatus();

  const assignments = assignmentsQuery.data?.data ?? [];

  console.log("assignments", assignments)

  function handleStatusUpdate(
    assignmentId: string,
    status: "ACCEPTED" | "REJECTED",
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
    return <div className="p-6">Loading assignments...</div>;
  }

  if (assignmentsQuery.isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load assignments. Please try again.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Assignments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage service requests assigned to you.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="font-semibold">No Assignments Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have any assigned service requests.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {assignments.map((assignment) => {
            const request = assignment.serviceRequest;

            return (
              <div
                key={assignment.id}
                className="space-y-4 rounded-xl border p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">
                    {request?.title ?? "Service Request"}
                  </h2>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {assignment.status}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Service</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.service?.name ?? "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.customer?.name ?? "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Customer Email</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.customer?.email ?? "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.customer?.phone ?? "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.location?.address ?? "Not available"}
                      {request?.location?.area
                        ? `, ${request.location.area}`
                        : ""}
                      {request?.location?.city
                        ? `, ${request.location.city}`
                        : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Preferred Date</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.preferredDate
                        ? new Date(
                            request.preferredDate,
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {request?.description ?? "No description available."}
                  </p>
                </div>

                {assignment.status === "PENDING" && (
                  <div className="flex flex-wrap gap-3 border-t pt-4">
                    <button
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        handleStatusUpdate(
                          assignment.id,
                          "ACCEPTED",
                        )
                      }
                      className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        handleStatusUpdate(
                          assignment.id,
                          "REJECTED",
                        )
                      }
                      className="rounded-md border border-red-500 px-5 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
