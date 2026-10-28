"use client";

import { useEffect, useState } from "react";
import {
  useCreateProviderProfile,
  useMyProviderProfile,
  useUpdateProviderProfile,
} from "@/hooks/provider.hook";
import type { ProviderProfilePayload } from "@/types/provider.type";
import { toast } from "@/components/ui/toast";

const emptyForm: ProviderProfilePayload = {
  bio: "",
  experienceYears: 0,
  serviceArea: "",
  latitude: undefined,
  longitude: undefined,
};

export default function ProviderProfilePage() {
  const [form, setForm] = useState<ProviderProfilePayload>(emptyForm);
  const [profileExists, setProfileExists] = useState(false);

  const profileQuery = useMyProviderProfile();
  const createMutation = useCreateProviderProfile();
  const updateMutation = useUpdateProviderProfile();

  const profile = profileQuery.data

  useEffect(() => {
    if (profile) {
      setProfileExists(true);
      setForm({
        bio: profile.bio ?? "",
        experienceYears: profile.experienceYears ?? 0,
        serviceArea: profile.serviceArea ?? "",
        latitude: profile.latitude ?? undefined,
        longitude: profile.longitude ?? undefined,
      });
    }
  }, [profile]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function updateField<K extends keyof ProviderProfilePayload>(
    field: K,
    value: ProviderProfilePayload[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: ProviderProfilePayload = {
      bio: form.bio?.trim() || undefined,
      experienceYears: Number(form.experienceYears ?? 0),
      serviceArea: form.serviceArea?.trim() || undefined,
      latitude:
        form.latitude === undefined || form.latitude === ("" as never)
          ? undefined
          : Number(form.latitude),
      longitude:
        form.longitude === undefined || form.longitude === ("" as never)
          ? undefined
          : Number(form.longitude),
    };

    const mutation = profileExists ? updateMutation : createMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        setProfileExists(true);

        toast.add({
          title: "Success",
          description: profileExists
            ? "Provider profile updated successfully."
            : "Provider profile created successfully.",
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
    });
  }

  if (profileQuery.isLoading) {
    return <div className="p-6">Loading provider profile...</div>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Provider Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your professional information and service area.
        </p>
      </div>

      {profileQuery.isError && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Profile information could not be loaded. If you have not created a
          profile yet, complete the form below.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border p-6"
      >
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Professional Bio
          </label>
          <textarea
            id="bio"
            value={form.bio ?? ""}
            onChange={(event) => updateField("bio", event.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Describe your experience and services..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="experienceYears" className="text-sm font-medium">
            Experience (years)
          </label>
          <input
            id="experienceYears"
            type="number"
            min={0}
            max={50}
            step={1}
            required
            value={form.experienceYears ?? 0}
            onChange={(event) =>
              updateField("experienceYears", Number(event.target.value))
            }
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="serviceArea" className="text-sm font-medium">
            Service Area
          </label>
          <input
            id="serviceArea"
            type="text"
            maxLength={255}
            value={form.serviceArea ?? ""}
            onChange={(event) => updateField("serviceArea", event.target.value)}
            placeholder="e.g. Chattogram"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="latitude" className="text-sm font-medium">
              Latitude (optional)
            </label>
            <input
              id="latitude"
              type="number"
              min={-90}
              max={90}
              step="any"
              value={form.latitude ?? ""}
              onChange={(event) =>
                updateField(
                  "latitude",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              placeholder="e.g. 22.3569"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="longitude" className="text-sm font-medium">
              Longitude (optional)
            </label>
            <input
              id="longitude"
              type="number"
              min={-180}
              max={180}
              step="any"
              value={form.longitude ?? ""}
              onChange={(event) =>
                updateField(
                  "longitude",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              placeholder="e.g. 91.7832"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {profile && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p>
              <strong>Verification:</strong>{" "}
              {profile.isVerified ? "Verified" : "Not verified"}
            </p>
            <p>
              <strong>Rating:</strong> {profile.rating}
            </p>
            <p>
              <strong>Total reviews:</strong> {profile.totalReviews}
            </p>
            <p>
              <strong>Completed jobs:</strong> {profile.totalJobs}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : profileExists
              ? "Update Profile"
              : "Create Profile"}
        </button>
      </form>
    </main>
  );
}