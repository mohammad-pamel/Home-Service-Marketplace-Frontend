
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
  createServiceRequest,
  createCustomerPayment,
  createCustomerBooking,
  rejectCustomerEstimate,
  approveCustomerEstimate,
  createCustomerReview,
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

// Create Customer Booking
export function useCreateCustomerBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customer-bookings"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-service-requests"],
        }),
      ]);
    },
  });
}

export function useGetMyEstimates() {
  return useQuery({
    queryKey: ["customer-estimates"],
    queryFn: getMyEstimates,
    retry: false,
  });
}

// Approve Estimate
export function useApproveCustomerEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCustomerEstimate,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customer-estimates"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-bookings"],
        }),
      ]);
    },
  });
}

// Reject Estimate
export function useRejectCustomerEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectCustomerEstimate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["customer-estimates"],
      });
    },
  });
}

export function useGetMyPayments() {
  return useQuery({
    queryKey: ["customer-payments"],
    queryFn: getMyPayments,
    retry: false,
  });
}

// Create Customer Payment
export function useCreateCustomerPayment() {
  return useMutation({
    mutationFn: createCustomerPayment,
  });
}

export function useGetMyReviews() {
  return useQuery({
    queryKey: ["customer-reviews"],
    queryFn: getMyReviews,
    retry: false,
  });
}

// Create Customer Review
export function useCreateCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerReview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customer-reviews"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-bookings"],
        }),
      ]);
    },
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


// Service Request

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["customer-service-requests"],
      });
    },
  });
}
