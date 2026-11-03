
"use client";

import { useState } from "react";
import {
  RefreshCw,
  Star,
  MessageSquare,
  PenLine,
  X,
} from "lucide-react";
import {
  useGetMyReviews,
  useGetMyBookings,
  useCreateCustomerReview,
} from "@/hooks/customer.hook";

type Review = {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  provider?: {
    name?: string;
  };
  booking?: {
    id: string;
    status: string;
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

type Booking = {
  id: string;
  status: string;
  provider?: {
    name?: string;
  };
  serviceRequest?: {
    service?: {
      name?: string;
    };
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
      <span className="ml-1 text-sm font-medium">{rating}/5</span>
    </div>
  );
}

export default function CustomerReviewsPage() {
  const {
    data: reviewData,
    isLoading: reviewsLoading,
    isError,
    error,
    refetch: refetchReviews,
    isFetching,
  } = useGetMyReviews();

  const {
    data: bookingData,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useGetMyBookings();

  const createReview = useCreateCustomerReview();

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewResponse = reviewData as
    | { data?: Review[] }
    | undefined;

  const bookingResponse = bookingData as
    | { data?: Booking[] }
    | undefined;

  const reviews = Array.isArray(reviewResponse?.data)
    ? reviewResponse.data
    : [];

  const bookings = Array.isArray(bookingResponse?.data)
    ? bookingResponse.data
    : [];

  const reviewedBookingIds = new Set(
    reviews.map((review) => review.bookingId),
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED" &&
      !reviewedBookingIds.has(booking.id),
  );

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      reviews.length
    : 0;

  const positiveReviews = reviews.filter(
    (review) => review.rating >= 4,
  ).length;

  async function handleSubmitReview() {
    if (!selectedBooking) return;

    try {
      await createReview.mutateAsync({
        bookingId: selectedBooking.id,
        rating,
        comment: comment.trim() || undefined,
      });

      setSelectedBooking(null);
      setRating(5);
      setComment("");
    } catch {
      // Mutation error is handled below.
    }
  }

  async function handleRefresh() {
    await Promise.all([
      refetchReviews(),
      refetchBookings(),
    ]);
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Reviews
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your experience and view your submitted reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
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

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Reviews"
          value={reviewsLoading ? "..." : reviews.length}
        />
        <SummaryCard
          title="Average Rating"
          value={
            reviewsLoading
              ? "..."
              : `${averageRating.toFixed(1)} / 5`
          }
        />
        <SummaryCard
          title="Positive Reviews"
          value={reviewsLoading ? "..." : positiveReviews}
        />
      </div>

      {/* Pending Reviews */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Pending Reviews</h2>
          <p className="text-sm text-muted-foreground">
            Share your feedback about completed services.
          </p>
        </div>

        {bookingsLoading ? (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Loading completed bookings...
          </div>
        ) : pendingBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <MessageSquare
              size={30}
              className="mx-auto mb-2 text-muted-foreground"
            />
            <p className="font-medium">No pending reviews</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Completed bookings that need your feedback will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <article
                key={booking.id}
                className="flex flex-col justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {booking.serviceRequest?.service?.name ??
                      "Service"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Provider: {booking.provider?.name ?? "Provider"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Booking ID: {booking.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(booking)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <PenLine size={16} />
                  Write Review
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Review Form */}
      {selectedBooking && (
        <div className="rounded-xl border p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Write a Review</h2>
              <p className="text-sm text-muted-foreground">
                {selectedBooking.serviceRequest?.service?.name ??
                  "Completed service"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="rounded-lg p-2 hover:bg-muted"
              aria-label="Close review form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">
                Your Rating
              </p>

              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`Rate ${value} out of 5`}
                    >
                      <Star
                        size={28}
                        className={
                          value <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }
                      />
                    </button>
                  );
                })}

                <span className="ml-2 text-sm font-medium">
                  {rating}/5
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="mb-2 block text-sm font-medium"
              >
                Your Comment (Optional)
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="Share your experience with this service..."
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <p className="mt-1 text-right text-xs text-muted-foreground">
                {comment.length}/2000
              </p>
            </div>

            {createReview.isError && (
              <p className="text-sm text-red-600">
                {createReview.error instanceof Error
                  ? createReview.error.message
                  : "Failed to submit review. Please try again."}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={createReview.isPending}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createReview.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Reviews */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">My Submitted Reviews</h2>
          <p className="text-sm text-muted-foreground">
            View the feedback you have already shared.
          </p>
        </div>

        {reviewsLoading ? (
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
              onClick={() => refetchReviews()}
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
                      <h3 className="font-semibold">{serviceName}</h3>
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
                    {review.comment?.trim() ||
                      "No written comment provided."}
                  </p>
                </article>
              );
            })}
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
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
