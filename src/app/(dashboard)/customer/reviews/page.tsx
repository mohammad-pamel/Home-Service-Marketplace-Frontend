"use client";

import { RefreshCw, Star, MessageSquare } from "lucide-react";
import { useGetMyReviews } from "@/hooks/customer.hook";

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  provider?: {
    name?: string;
  };
  booking?: {
    provider?: {
      name?: string;
    };
    serviceRequest?: {
      service?: {
        name?: string;
      };
    };
  };
  service?: {
    name?: string;
  };
};

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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
    //   aria-label={`Rating: ${rating} out of 5`}
    >
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
      <span className="ml-1 text-sm font-medium">{rating}/5</span>
    </div>
  );
}

export default function CustomerReviewsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetMyReviews();

  const response = data as { data?: Review[] } | undefined;
  const reviews = Array.isArray(response?.data) ? response.data : [];

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      reviews.length
    : 0;

  const positiveReviews = reviews.filter(
    (review) => review.rating >= 4,
  ).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Reviews
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View the feedback you have shared about your services.
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

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Reviews"
          value={isLoading ? "..." : reviews.length}
        />
        <SummaryCard
          title="Average Rating"
          value={isLoading ? "..." : `${averageRating.toFixed(1)} / 5`}
        />
        <SummaryCard
          title="Positive Reviews"
          value={isLoading ? "..." : positiveReviews}
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Loading reviews...
        </div>
      ) : isError ? (
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
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <MessageSquare
            size={36}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <h3 className="font-semibold">No reviews yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your submitted reviews will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const serviceName =
              review.booking?.serviceRequest?.service?.name ??
              review.service?.name ??
              "Service review";

            const providerName =
              review.provider?.name ??
              review.booking?.provider?.name ??
              "Provider";

            return (
              <article
                key={review.id}
                className="space-y-3 rounded-xl border p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="font-semibold">{serviceName}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Provider: {providerName}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <RatingStars rating={review.rating} />

                <p className="text-sm leading-6">
                  {review.comment?.trim() || "No written comment provided."}
                </p>
              </article>
            );
          })}
        </div>
      )}
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
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
