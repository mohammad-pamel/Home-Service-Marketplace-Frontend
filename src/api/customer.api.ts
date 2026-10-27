
import apiClient from "@/lib/apiClient";

// Customer's own service requests
export function getMyServiceRequests() {
  return apiClient("/service-requests/my-requests");
}

export function cancelMyServiceRequest(requestId: string) {
  return apiClient(`/service-requests/${requestId}/cancel`, {
    method: "PATCH",
  });
}

// Customer's own bookings
export function getMyBookings() {
  return apiClient("/bookings/my-bookings");
}

// Estimates received by the customer
export function getMyEstimates() {
  return apiClient("/estimates/customer");
}

// Customer's payment history
export function getMyPayments() {
  return apiClient("/payments/my-payments");
}

// Reviews submitted by the customer
export function getMyReviews() {
  return apiClient("/reviews/my-reviews");
}

// Logged-in user's profile
export function getMyProfile() {
  return apiClient("/auth/me");
}

// Update logged-in user's profile
export function updateMyProfile(payload: {
  name?: string;
  phone?: string;
  imageUrl?: string;
}) {
  return apiClient("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}


