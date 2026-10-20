import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Category,
  CreateCategoryPayload,
  CreateServicePayload,
  PaginatedResponse,
  Provider,
  Service,
  ServiceRequest,
  UpdateCategoryVariables,
  UpdateServiceVariables,
} from "@/types";


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
