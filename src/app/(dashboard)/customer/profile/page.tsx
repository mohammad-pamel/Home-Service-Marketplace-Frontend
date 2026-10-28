"use client";

import { useEffect, useState } from "react";
import { RefreshCw, UserRound, Save } from "lucide-react";
import {
  useGetMyProfile,
  useUpdateMyProfile,
} from "@/hooks/customer.hook";

type CustomerProfile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  imageUrl?: string | null;
};

export default function CustomerProfilePage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetMyProfile();

  const updateProfile = useUpdateMyProfile();

  const response = data as
    | { data?: CustomerProfile }
    | undefined;

  const profile = response?.data;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!profile || initialized) return;

    setName(profile.name ?? "");
    setPhone(profile.phone ?? "");
    setInitialized(true);
  }, [profile, initialized]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateProfile.mutate(
      {
        name: name.trim(),
        phone: phone.trim(),
      },
      {
        onSuccess: () => {
          setInitialized(false);
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load your profile."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Profile information is unavailable.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and update your personal information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep your contact details up to date.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={profile.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border bg-muted px-3 py-2.5 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Email is read-only on this page.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Enter your phone number"
            />
          </div>

          {updateProfile.isError && (
            <p className="text-sm text-red-600">
              {updateProfile.error instanceof Error
                ? updateProfile.error.message
                : "Failed to update profile."}
            </p>
          )}

          {updateProfile.isSuccess && (
            <p className="text-sm text-green-600">
              Profile updated successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {updateProfile.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
