
import apiClient from "@/lib/apiClient";
import { Availability, Booking, CreateAvailabilityPayload, CreateEstimatePayload, CreateWorkLogPayload, Estimate, PaginatedResponse, Payment, Review, Service, UpdateAvailabilityPayload, UpdateEstimatePayload, UpdateWorkLogPayload, WorkLog } from "@/types";
import type {
    Assignment,
  CreateProviderServicePayload,
  ProviderProfile,
  ProviderProfilePayload,
  ProviderService,
  UpdateProviderServicePayload,
} from "@/types/provider.type";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Get provider profile
export const getMyProviderProfile = async (): Promise<ProviderProfile> => {
  const response = await apiClient<ApiResponse<ProviderProfile>>(
    "/providers/profile",
    {
      method: "GET",
    },
  );

  return response.data;
};

// Create provider profile
export const createProviderProfile = async (
  payload: ProviderProfilePayload,
): Promise<ProviderProfile> => {
  const response = await apiClient<ApiResponse<ProviderProfile>>(
    "/providers/profile",
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
};

// Update provider profile
export const updateProviderProfile = async (
  payload: ProviderProfilePayload,
): Promise<ProviderProfile> => {
  const response = await apiClient<ApiResponse<ProviderProfile>>(
    "/providers/profile",
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
};



// Get logged-in provider's assignments
export function getMyAssignments() {
  return apiClient<ApiResponse<Assignment[]>>(
    "/assignments/my-assignments",
  );
}

// Accept or reject an assignment
export function updateMyAssignmentStatus(
  assignmentId: string,
  status: "ACCEPTED" | "REJECTED",
) {
  return apiClient<ApiResponse<Assignment>>(
    `/assignments/${assignmentId}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}




// Provider My Services

// Get logged-in provider's services
export function getMyProviderServices() {
  return apiClient<ApiResponse<ProviderService[]>>(
    "/provider-services/my-services",
  );
}

// Add a service to provider profile
export function addProviderService(
  payload: CreateProviderServicePayload,
) {
  return apiClient<ApiResponse<ProviderService>>(
    "/provider-services",
    {
      method: "POST",
      body: payload,
    },
  );
}

// Update provider service price
export function updateProviderService(
  serviceId: string,
  payload: UpdateProviderServicePayload,
) {
  return apiClient<ApiResponse<ProviderService>>(
    `/provider-services/${serviceId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

// Remove a service from provider profile
export function removeProviderService(serviceId: string) {
  return apiClient<ApiResponse<null>>(
    `/provider-services/${serviceId}`,
    {
      method: "DELETE",
    },
  );
}



// Get available services from the service catalog
export function getAvailableServices() {
  return apiClient<ApiResponse<PaginatedResponse<Service>>>(
    "/services?status=active&limit=100",
  );
}



// Get logged-in provider's availability
export function getMyAvailability() {
  return apiClient<ApiResponse<Availability[]>>(
    "/availability/my-availability",
    {
      method: "GET",
    },
  );
}

// Create availability
export function createMyAvailability(
  payload: CreateAvailabilityPayload,
) {
  return apiClient<ApiResponse<Availability>>("/availability", {
    method: "POST",
    body: payload,
  });
}

// Update availability
export function updateMyAvailability(
  id: string,
  payload: UpdateAvailabilityPayload,
) {
  return apiClient<ApiResponse<Availability>>(`/availability/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

// Delete availability
export function deleteMyAvailability(id: string) {
  return apiClient<ApiResponse<null>>(`/availability/${id}`, {
    method: "DELETE",
  });
}




// Get provider's bookings
export function getMyBookings() {
  return apiClient<ApiResponse<Booking[]>>(
    "/bookings/my-bookings",
    {
      method: "GET",
    },
  );
}

// Get booking details
export function getBookingDetails(id: string) {
  return apiClient<ApiResponse<Booking>>(`/bookings/${id}`, {
    method: "GET",
  });
}



// Get provider's estimates
export function getMyEstimates() {
  return apiClient<ApiResponse<Estimate[]>>("/estimates/provider", {
    method: "GET",
  });
}

// Get estimate details
export function getEstimateDetails(id: string) {
  return apiClient<ApiResponse<Estimate>>(`/estimates/${id}`, {
    method: "GET",
  });
}

// Create estimate
export function createEstimate(payload: CreateEstimatePayload) {
  return apiClient<ApiResponse<Estimate>>("/estimates", {
    method: "POST",
    body: payload,
  });
}

// Update estimate
export function updateEstimate(
  id: string,
  payload: UpdateEstimatePayload,
) {
  return apiClient<ApiResponse<Estimate>>(`/estimates/${id}`, {
    method: "PATCH",
    body: payload,
  });
}



// Get My Work Logs
export function getMyWorkLogs() {
  return apiClient<ApiResponse<WorkLog[]>>(
    "/work-logs/my-logs",
    {
      method: "GET",
    }
  );
}

// Get Work Logs By Booking
export function getWorkLogsByBooking(bookingId: string) {
  return apiClient<ApiResponse<WorkLog[]>>(
    `/work-logs/booking/${bookingId}`,
    {
      method: "GET",
    }
  );
}

// Create Work Log
export function createWorkLog(payload: CreateWorkLogPayload) {
  return apiClient<ApiResponse<WorkLog>>(
    "/work-logs",
    {
      method: "POST",
      body: payload,
    }
  );
}

// Update Work Log
export function updateWorkLog(
  id: string,
  payload: UpdateWorkLogPayload
) {
  return apiClient<ApiResponse<WorkLog>>(
    `/work-logs/${id}`,
    {
      method: "PATCH",
      body: payload,
    }
  );
}

// Delete Work Log
export function deleteWorkLog(id: string) {
  return apiClient<ApiResponse<null>>(
    `/work-logs/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Complete Work Log
export function completeWorkLog(id: string) {
  return apiClient<ApiResponse<WorkLog>>(
    `/work-logs/${id}/complete`,
    {
      method: "PATCH",
    }
  );
}


// Get Provider Reviews
export function getProviderReviews(providerId: string) {
  return apiClient<ApiResponse<Review[]>>(
    `/reviews/provider/${providerId}`,
    {
      method: "GET",
    }
  );
}



// Get My Provider Payments
export function getMyProviderPayments() {
  return apiClient<ApiResponse<Payment[]>>(
    "/payments/provider/my-payments",
    {
      method: "GET",
    }
  );
}