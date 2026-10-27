
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMyServiceRequests,
  getMyBookings,
  getMyEstimates,
  getMyPayments,
  getMyReviews,
  getMyProfile,
  updateMyProfile,
  cancelMyServiceRequest,
} from "@/api/customer.api";

export function useGetMyServiceRequests() {
  return useQuery({
    queryKey: ["customer-service-requests"],
    queryFn: getMyServiceRequests,
    retry: false,
  });
}

export function useCancelMyServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMyServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-service-requests"],
      });
    },
  });
}

export function useGetMyBookings() {
  return useQuery({
    queryKey: ["customer-bookings"],
    queryFn: getMyBookings,
    retry: false,
  });
}

export function useGetMyEstimates() {
  return useQuery({
    queryKey: ["customer-estimates"],
    queryFn: getMyEstimates,
    retry: false,
  });
}

export function useGetMyPayments() {
  return useQuery({
    queryKey: ["customer-payments"],
    queryFn: getMyPayments,
    retry: false,
  });
}

export function useGetMyReviews() {
  return useQuery({
    queryKey: ["customer-reviews"],
    queryFn: getMyReviews,
    retry: false,
  });
}

export function useGetMyProfile() {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: getMyProfile,
    retry: false,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-profile"],
      });
    },
  });
}
