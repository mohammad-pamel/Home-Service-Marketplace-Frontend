
"use client";

import { useState } from "react";
import {
  useMyAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
} from "@/hooks/provider.hook";
import type {
  Availability,
  CreateAvailabilityPayload,
} from "@/types/availability.type";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const initialForm: CreateAvailabilityPayload = {
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
};

export default function ProviderAvailabilityPage() {
  const [form, setForm] =
    useState<CreateAvailabilityPayload>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const availabilityQuery = useMyAvailability();
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();

  const availability: Availability[] =
    availabilityQuery.data?.data ?? [];

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      toast.add({
        title: "Invalid time",
        description: "End time must be later than start time.",
        type: "error",
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          payload: form,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Success",
              description: "Availability updated successfully.",
              type: "success",
            });
            resetForm();
          },
          onError: () => {
            toast.add({
              title: "Error",
              description: "Failed to update availability.",
              type: "error",
            });
          },
        },
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description: "Availability created successfully.",
            type: "success",
          });
          resetForm();
        },
        onError: () => {
          toast.add({
            title: "Error",
            description:
              "Failed to create availability. You may already have a schedule for this day.",
            type: "error",
          });
        },
      });
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (item: Availability) => {
    setEditingId(item.id);
    setForm({
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      isAvailable: item.isAvailable,
    });
  };

  const handleToggle = (item: Availability) => {
    updateMutation.mutate(
      {
        id: item.id,
        payload: {
          isAvailable: !item.isAvailable,
        },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description: "Availability status updated.",
            type: "success",
          });
        },
        onError: () => {
          toast.add({
            title: "Error",
            description: "Failed to update availability status.",
            type: "error",
          });
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.add({
          title: "Success",
          description: "Availability deleted successfully.",
          type: "success",
        });

        if (editingId === id) {
          resetForm();
        }
      },
      onError: () => {
        toast.add({
          title: "Error",
          description: "Failed to delete availability.",
          type: "error",
        });
      },
    });
  };

  if (availabilityQuery.isLoading) {
    return <div className="p-6">Loading availability...</div>;
  }

  if (availabilityQuery.isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load availability. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Availability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your weekly working schedule.
        </p>
      </div>

      {/* Create / Update Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border p-5"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Update Schedule" : "Add New Schedule"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="dayOfWeek" className="text-sm font-medium">
              Day
            </label>
            <select
              id="dayOfWeek"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({
                  ...form,
                  dayOfWeek: Number(e.target.value),
                })
              }
              disabled={!!editingId}
              className="w-full rounded-md border bg-background p-2"
            >
              {days.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium">
              Start Time
            </label>
            <Input
              id="startTime"
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium">
              End Time
            </label>
            <Input
              id="endTime"
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAvailable ?? true}
            onChange={(e) =>
              setForm({ ...form, isAvailable: e.target.checked })
            }
          />
          Available on this day
        </label>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : editingId
                ? "Update Schedule"
                : "Add Schedule"}
          </Button>

          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Availability List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Weekly Schedule</h2>

        {availability.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-muted-foreground">
            No availability schedule added yet.
          </div>
        ) : (
          availability.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {days[item.dayOfWeek] ?? "Unknown day"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.startTime} - {item.endTime}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    item.isAvailable ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggle(item)}
                  disabled={updateMutation.isPending}
                >
                  {item.isAvailable ? "Disable" : "Enable"}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

