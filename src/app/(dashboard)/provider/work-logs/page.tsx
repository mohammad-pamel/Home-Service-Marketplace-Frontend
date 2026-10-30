"use client";

import { useState } from "react";
import {
  useMyWorkLogs,
  useCreateWorkLog,
  useUpdateWorkLog,
  useDeleteWorkLog,
  useCompleteWorkLog,
  useMyBookings,
} from "@/hooks/provider.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { CreateWorkLogPayload, WorkLog } from "@/types";

const initialForm = {
  bookingId: "",
  title: "",
  description: "",
  startedAt: "",
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("data" in error) {
      const data = error.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }

    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export default function ProviderWorkLogsPage() {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useMyWorkLogs();
  const { data: bookingsData } = useMyBookings();

  const createMutation = useCreateWorkLog();
  const updateMutation = useUpdateWorkLog();
  const deleteMutation = useDeleteWorkLog();
  const completeMutation = useCompleteWorkLog();

  const workLogs: WorkLog[] = data?.data ?? [];
  const bookings = bookingsData?.data ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CreateWorkLogPayload = {
      bookingId: form.bookingId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      startedAt: form.startedAt
        ? new Date(form.startedAt).toISOString()
        : undefined,
    };

    if (editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          payload: {
            title: payload.title,
            description: payload.description,
            startedAt: payload.startedAt,
          },
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Success",
              description: "Work log updated successfully.",
              type: "success",
            });
            resetForm();
          },
          onError: (error) => {
            toast.add({
              title: "Update Failed",
              description: getErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description: "Work log created successfully.",
            type: "success",
          });
          resetForm();
        },
        onError: (error) => {
          const message = getErrorMessage(error);

          toast.add({
            title: "Unable to Create Work Log",
            description: message.includes("already an active work log")
              ? "This booking already has an active work log. Please use the existing work log."
              : message,
            type: "error",
          });
        },
      });
    }
  };

  const handleEdit = (workLog: WorkLog) => {
    setEditingId(workLog.id);

    setForm({
      bookingId: workLog.bookingId,
      title: workLog.title,
      description: workLog.description ?? "",
      startedAt: workLog.startedAt
        ? new Date(workLog.startedAt).toISOString().slice(0, 16)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this work log?")) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.add({
          title: "Success",
          description: "Work log deleted successfully.",
          type: "success",
        });

        if (editingId === id) resetForm();
      },
      onError: (error) => {
        toast.add({
          title: "Delete Failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  const handleComplete = (id: string) => {
    if (!window.confirm("Are you sure you want to complete this work log?")) {
      return;
    }

    completeMutation.mutate(id, {
      onSuccess: () => {
        toast.add({
          title: "Success",
          description: "Work log completed successfully.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Completion Failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  //   const availableBookings = bookings.filter(
  //     (booking) =>
  //       booking.status === "CONFIRMED" ||
  //       booking.status === "IN_PROGRESS"
  //   );

  const existingActiveBookingIds = new Set(
    workLogs.filter((log) => !log.completedAt).map((log) => log.bookingId),
  );

  const availableBookings = bookings.filter(
    (booking) =>
      (booking.status === "CONFIRMED" || booking.status === "IN_PROGRESS") &&
      !existingActiveBookingIds.has(booking.id),
  );

  if (isLoading) {
    return <div className="p-6">Loading work logs...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load work logs. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Work Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your service work progress.
        </p>
      </div>

      {/* Create / Update Form */}
      <div className="rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Update Work Log" : "Create Work Log"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div className="space-y-2">
              <label htmlFor="bookingId" className="text-sm font-medium">
                Select Booking
              </label>

              <select
                id="bookingId"
                name="bookingId"
                value={form.bookingId}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Select a booking</option>

                {availableBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.serviceRequest?.service?.name ?? "Service"} —{" "}
                    {booking.customer?.name ?? "Customer"} ({booking.status})
                  </option>
                ))}
              </select>

              {availableBookings.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No bookings available for creating a new work log.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Work Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter work title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the work..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="startedAt" className="text-sm font-medium">
              Started At
            </label>
            <Input
              id="startedAt"
              name="startedAt"
              type="datetime-local"
              value={form.startedAt}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingId
                  ? "Update Work Log"
                  : "Create Work Log"}
            </Button>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Work Log List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Work Log History ({workLogs.length})
        </h2>

        {workLogs.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="font-medium">No work logs found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first work log using the form above.
            </p>
          </div>
        ) : (
          workLogs.map((workLog) => {
            const isCompleted = Boolean(workLog.completedAt);

            return (
              <div key={workLog.id} className="space-y-4 rounded-xl border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{workLog.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {workLog.booking?.serviceRequest?.service?.name ??
                        "Service"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>

                {workLog.description && (
                  <p className="text-sm text-muted-foreground">
                    {workLog.description}
                  </p>
                )}

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {workLog.booking?.customer?.name ?? "N/A"}
                  </p>

                  <p>
                    <span className="font-medium">Started:</span>{" "}
                    {new Date(workLog.startedAt).toLocaleString()}
                  </p>

                  {workLog.completedAt && (
                    <p>
                      <span className="font-medium">Completed:</span>{" "}
                      {new Date(workLog.completedAt).toLocaleString()}
                    </p>
                  )}

                  <p>
                    <span className="font-medium">Booking ID:</span>{" "}
                    {workLog.bookingId}
                  </p>
                </div>

                {!isCompleted && (
                  <div className="flex flex-wrap gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(workLog)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleComplete(workLog.id)}
                      disabled={completeMutation.isPending}
                    >
                      Complete
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(workLog.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
