
"use client";

import { RefreshCw, Star, MessageSquare } from "lucide-react";
import {
  useMyProviderProfile,
  useProviderReviews,
} from "@/hooks/provider.hook";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          size={16}
          className={
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }
        />
      ))}
      <span className="ml-1 text-sm font-medium">
        {rating}/5
      </span>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function ProviderReviewsPage() {
  // Get logged-in provider profile
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useMyProviderProfile();

  // Provider Profile ID
  // const providerId = profile?.id;
  const providerId = profile?.userId;

  // Get reviews using Provider Profile ID
  const {
    data: reviewResponse,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error,
    refetch,
    isFetching,
  } = useProviderReviews(providerId ?? "");

  // Extract reviews
  const reviews = Array.isArray(reviewResponse?.data)
    ? reviewResponse.data
    : [];

  // Loading state
  if (profileLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading provider profile...
      </div>
    );
  }

  // Profile error
  if (profileError || !providerId) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <MessageSquare
          size={36}
          className="mx-auto mb-3 text-muted-foreground"
        />
        <h2 className="font-semibold">
          Provider Profile Not Found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please create your provider profile first.
        </p>
      </div>
    );
  }

  // Reviews loading
  if (reviewsLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading reviews...
      </div>
    );
  }

  // Reviews error
  if (reviewsError) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="font-medium text-red-600">
          Failed to load reviews.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Please try again."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / reviews.length
      : 0;

  // Positive reviews
  const positiveReviews = reviews.filter(
    (review) => review.rating >= 4,
  ).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Reviews
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            See what customers say about your services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Reviews"
          value={reviews.length}
        />

        <SummaryCard
          title="Average Rating"
          value={`${averageRating.toFixed(1)} / 5`}
        />

        <SummaryCard
          title="Positive Reviews"
          value={positiveReviews}
        />
      </div>

      {/* Customer Reviews */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Customer Reviews
          </h2>

          <p className="text-sm text-muted-foreground">
            Feedback shared by customers who completed your services.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <MessageSquare
              size={36}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <h3 className="font-semibold">
              No reviews available yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Customer reviews will appear here after they submit
              feedback for your completed services.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="space-y-3 rounded-xl border p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-semibold">
                      {review.customer?.name ?? "Customer"}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.booking?.serviceRequest?.service?.name ??
                        "Service"}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <RatingStars rating={review.rating} />

                <p className="text-sm leading-6">
                  {review.comment?.trim() ||
                    "No written comment provided."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
