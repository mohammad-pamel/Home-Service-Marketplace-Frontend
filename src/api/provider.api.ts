
import apiClient from "@/lib/apiClient";
import type {
  ProviderProfile,
  ProviderProfilePayload,
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
