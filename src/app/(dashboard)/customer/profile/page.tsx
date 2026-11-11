"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Save, UserRound } from "lucide-react";
import { useGetMyProfile, useUpdateMyProfile } from "@/hooks/customer.hook";
import CustomerProfileSkeleton from "@/components/shared/customer-profile-skeleton";
import ProfileImageUpload from "@/components/shared/profile-image-upload";

type CustomerProfile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  imageUrl?: string | null;
};

export default function CustomerProfilePage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetMyProfile();

  const updateProfile = useUpdateMyProfile();

  const response = data as { data?: CustomerProfile } | undefined;

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
    return <CustomerProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border bg-card p-6 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load your profile."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Profile information is unavailable.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and profile picture.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Card Header */}
        <div className="border-b bg-muted/30 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="font-semibold">Personal Details</h2>
              <p className="text-xs text-muted-foreground">
                Update your account information.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          {/* Profile Image */}
          <ProfileImageUpload
            imageUrl={profile?.imageUrl}
            userType="customer"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
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
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
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
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={profile.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Your email address cannot be changed here.
            </p>
          </div>

          {/* Feedback */}
          {updateProfile.isError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {updateProfile.error instanceof Error
                ? updateProfile.error.message
                : "Failed to update profile."}
            </p>
          )}

          {updateProfile.isSuccess && (
            <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700">
              Profile updated successfully.
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-end border-t pt-5">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
