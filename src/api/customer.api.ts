
import apiClient from "@/lib/apiClient";
import { ApiResponse, CreatePaymentPayload, CreatePaymentResponse, CreateServiceRequestPayload } from "@/types";

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

// Create Customer Booking
export function createCustomerBooking(payload: {
  serviceRequestId: string;
  scheduledAt: string;
}) {
  return apiClient("/bookings", {
    method: "POST",
    body: payload,
  });
}

// Estimates received by the customer
export function getMyEstimates() {
  return apiClient("/estimates/customer");
}

// Approve Customer Estimate
export function approveCustomerEstimate(estimateId: string) {
  return apiClient(`/estimates/${estimateId}/approve`, {
    method: "PATCH",
  });
}

// Reject Customer Estimate
export function rejectCustomerEstimate(estimateId: string) {
  return apiClient(`/estimates/${estimateId}/reject`, {
    method: "PATCH",
  });
}

// Customer's payment history
export function getMyPayments() {
  return apiClient("/payments/my-payments");
}

// Create Customer Payment
export function createCustomerPayment(payload: CreatePaymentPayload) {
  return apiClient<ApiResponse<CreatePaymentResponse>>("/payments", {
    method: "POST",
    body: payload,
  });
}

// Reviews submitted by the customer
export function getMyReviews() {
  return apiClient("/reviews/my-reviews");
}

// // Reviews submitted by the customer
// export function getMyReviews() {
//   return apiClient("/reviews/my-reviews");
// }

// Create Customer Review
export function createCustomerReview(payload: {
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  return apiClient("/reviews", {
    method: "POST",
    body: payload,
  });
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

// Upload logged-in user's profile image
export function uploadMyProfileImage(file: File) {
  const formData = new FormData();

  formData.append("profileImage", file);

  return apiClient("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
}


// Service Request related api

export async function createServiceRequest(
  payload: CreateServiceRequestPayload,
) {
  return apiClient("/service-requests", {
    method: "POST",
    body: payload,
  });
}


