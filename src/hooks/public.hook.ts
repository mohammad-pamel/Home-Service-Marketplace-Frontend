import { useQuery } from "@tanstack/react-query";
import {
  getPublicCategories,
  getPublicServices,
  getPublicServiceDetails,
} from "@/api/public.api";

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: getPublicCategories,
    retry: false,
  });
}

export function usePublicServices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active";
}) {
  return useQuery({
    queryKey: ["public-services", params],
    queryFn: () => getPublicServices(params),
    retry: false,
  });
}

export function usePublicServiceDetails(serviceId: string) {
  return useQuery({
    queryKey: ["public-service-details", serviceId],
    queryFn: () => getPublicServiceDetails(serviceId),
    enabled: !!serviceId,
    retry: false,
  });
}