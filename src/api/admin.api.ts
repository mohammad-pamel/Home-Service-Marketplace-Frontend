import apiClient from "@/lib/apiClient";
import { ApiResponse, Category, CreateCategoryPayload } from "@/types";

export function getAllUsers() {
  return apiClient("/user");
}

export function getAllCategories() {
  return apiClient("/categories");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(payload: CreateCategoryPayload, categoryId: string) {
  return apiClient<ApiResponse<Category>>("/categories/${categoryId}", {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(categoryId: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}