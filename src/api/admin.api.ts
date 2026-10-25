import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Assignment,
  Category,
  CreateCategoryPayload,
  CreateServicePayload,
  Estimate,
  PaginatedResponse,
  Payment,
  Provider,
  Service,
  ServiceRequest,
  UpdateCategoryVariables,
  UpdateServiceVariables,
  WorkLog,
} from "@/types";
import { Availability } from "@/types/availability.type";


// Users related api

export function getAllUsers() {
  return apiClient("/user");
}


// Category related api

export function getAllCategories() {
  return apiClient("/categories");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory({
  payload,
  categoryId,
}: UpdateCategoryVariables) {
  return apiClient<ApiResponse<Category>>(`/categories/${categoryId}`, {
    method: "PATCH",
    body: payload,
  });
}

// export function updateCategory(payload: CreateCategoryPayload, categoryId: string) {
//   // biome-ignore lint/suspicious/noTemplateCurlyInString: <explanation>
//   return apiClient<ApiResponse<Category>>(`/categories/${categoryId}`, {
//     method: "PATCH",
//     body: payload,
//   });
// }

export function deleteCategory(categoryId: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}


// Service related api

export function getAllServices() {
  return apiClient<ApiResponse<PaginatedResponse<Service>>>("/services");
}

export function createService(payload: CreateServicePayload) {
  return apiClient<ApiResponse<Service>>("/services", {
    method: "POST",
    body: payload,
  });
}

export function updateService({ serviceId, payload }: UpdateServiceVariables) {
  return apiClient<ApiResponse<Service>>(`/services/${serviceId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteService(serviceId: string) {
  return apiClient<ApiResponse<Service>>(`/services/${serviceId}`, {
    method: "DELETE",
  });
}


// Provider related api

export function getAllProviders() {
  return apiClient<ApiResponse<Provider[]>>("/providers");
}


export function verifyProvider(providerId: string) {
  return apiClient<ApiResponse<Provider>>(
    `/providers/${providerId}/verify`,
    {
      method: "PATCH",
    },
  );
}

export function unverifyProvider(providerId: string) {
  return apiClient<ApiResponse<Provider>>(
    `/providers/${providerId}/unverify`,
    {
      method: "PATCH",
    },
  );
}


// Service Request related api

export function getAllServiceRequests() {
  return apiClient<ApiResponse<ServiceRequest[]>>("/service-requests");
}



// export function getAllProviders() {
//   return apiClient<ApiResponse<ProviderProfile[]>>("/providers");
// }

// export function createAssignment(payload: {
//   serviceRequestId: string;
//   providerId: string;
// }) {
//   return apiClient<ApiResponse<Assignment>>("/assignments", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

export function createAssignment(payload: {
  serviceRequestId: string;
  providerId: string;
}) {
  return apiClient<ApiResponse<Assignment>>("/assignments", {
    method: "POST",
    body: payload,
  });
}
export function getAssignmentsByRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<Assignment[]>>(
    `/assignments/request/${serviceRequestId}`,
  );
}


// Bookings related api

export function getAllBookings() {
  return apiClient("/bookings");
}


// Payments related api

// export function getAllPayments() {
//   return apiClient("/payments");
// }

export function getAllPayments() {
  return apiClient<ApiResponse<Payment[]>>("/payments");
}


// Availability related api


export function getAllAvailability() {
  return apiClient<ApiResponse<Availability[]>>("/availability");
}


// Estimates related api

export function getAllEstimates() {
  return apiClient<ApiResponse<Estimate[]>>("/estimates");
}


// Work Logs related api

export function getAllWorkLogs() {
  return apiClient<ApiResponse<WorkLog[]>>("/work-logs");
}