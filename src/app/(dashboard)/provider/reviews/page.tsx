
"use client";

import { useMyProviderProfile, useProviderReviews } from "@/hooks/provider.hook";

export default function ProviderReviewsPage() {
  const { data: profileResponse, isLoading: profileLoading } =
    useMyProviderProfile();

 const profile = profileResponse;

console.log("profile", profile);

const providerId = profile?.id;

//   const {
//     data: reviewResponse,
//     isLoading: reviewsLoading,
//     isError,
//   } = useProviderReviews(providerId ?? "");

  const {
  data: reviewResponse,
  isLoading: reviewsLoading,
  isError,
} = useProviderReviews(providerId ?? "");

  const reviews = reviewResponse?.data ?? [];

  if (profileLoading || reviewsLoading) {
    return <div className="p-6">Loading reviews...</div>;
  }

  if (!providerId) {
    return (
      <div className="p-6">
        Please create your provider profile first.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        Failed to load reviews. Please try again.
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">
          See what customers say about your services.
        </p>
      </div>

      <div className="rounded-lg border p-5">
        <p className="text-sm text-muted-foreground">Average Rating</p>
        <h2 className="text-3xl font-bold">
          {averageRating.toFixed(1)} / 5
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on {reviews.length} reviews
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="rounded-lg border p-5 text-sm text-muted-foreground">
            No reviews available yet.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-2 rounded-lg border p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  {review.customer?.name ?? "Customer"}
                </h3>
                <span className="font-medium">
                  {review.rating} / 5 ★
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {review.comment || "No comment provided."}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
