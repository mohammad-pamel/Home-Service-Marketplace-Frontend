import apiClient from "@/lib/apiClient";

export function getPublicCategories() {
  return apiClient("/categories");
}

export function getPublicServices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active";
}) {
  return apiClient("/services", {
    query: params,
  });
}

export function getPublicServiceDetails(serviceId: string) {
  return apiClient(`/services/${serviceId}`);
}