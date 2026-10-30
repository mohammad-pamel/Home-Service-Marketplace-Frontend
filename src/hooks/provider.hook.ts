
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
    addProviderService,
  createEstimate,
  createMyAvailability,
  createProviderProfile,
  deleteMyAvailability,
  getAvailableServices,
  getBookingDetails,
  getEstimateDetails,
  getMyAssignments,
  getMyAvailability,
  getMyBookings,
  getMyEstimates,
  getMyProviderProfile,
  getMyProviderServices,
  removeProviderService,
  updateEstimate,
  updateMyAssignmentStatus,
  updateMyAvailability,
  updateProviderProfile,
  updateProviderService,
} from "@/api/provider.api";

import type { CreateProviderServicePayload, ProviderProfilePayload, UpdateProviderServicePayload } from "@/types/provider.type";
import { CreateAvailabilityPayload, CreateEstimatePayload, UpdateAvailabilityPayload, UpdateEstimatePayload } from "@/types";

const PROVIDER_PROFILE_KEY = ["provider-profile"];

export const useMyProviderProfile = () => {
  return useQuery({
    queryKey: PROVIDER_PROFILE_KEY,
    queryFn: getMyProviderProfile,
    retry: false,
  });
};

export const useCreateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProviderProfilePayload) =>
      createProviderProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROVIDER_PROFILE_KEY,
      });
    },
  });
};

export const useUpdateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProviderProfilePayload) =>
      updateProviderProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROVIDER_PROFILE_KEY,
      });
    },
  });
};




// export const useMyAssignments = () => {
//   return useQuery({
//     queryKey: ["provider-assignments"],
//     queryFn: getMyAssignments,
//     retry: false,
//   });
// };

export const useMyAssignments = () => {
  return useQuery({
    queryKey: ["provider-assignments"],
    queryFn: getMyAssignments,
    retry: 1,
    refetchOnMount: "always",
  });
};

export const useUpdateMyAssignmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      status,
    }: {
      assignmentId: string;
      status: "ACCEPTED" | "REJECTED";
    }) => updateMyAssignmentStatus(assignmentId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-assignments"],
      });
    },
  });
};




const PROVIDER_SERVICES_KEY = ["provider-services"];

export const useMyProviderServices = () => {
  return useQuery({
    queryKey: PROVIDER_SERVICES_KEY,
    queryFn: getMyProviderServices,
    retry: false,
  });
};

export const useAddProviderService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProviderServicePayload) =>
      addProviderService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROVIDER_SERVICES_KEY,
      });
    },
  });
};

export const useUpdateProviderService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: string;
      payload: UpdateProviderServicePayload;
    }) => updateProviderService(serviceId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROVIDER_SERVICES_KEY,
      });
    },
  });
};

export const useRemoveProviderService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) =>
      removeProviderService(serviceId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROVIDER_SERVICES_KEY,
      });
    },
  });
};



export const useAvailableServices = () => {
  return useQuery({
    queryKey: ["available-services"],
    queryFn: getAvailableServices,
    retry: false,
  });
};



// Get provider's availability
export const useMyAvailability = () => {
  return useQuery({
    queryKey: ["provider-availability"],
    queryFn: getMyAvailability,
    retry: false,
  });
};

// Create availability
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAvailabilityPayload) =>
      createMyAvailability(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-availability"],
      });
    },
  });
};

// Update availability
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAvailabilityPayload;
    }) => updateMyAvailability(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-availability"],
      });
    },
  });
};

// Delete availability
export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMyAvailability(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-availability"],
      });
    },
  });
};





// Get provider's bookings
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["provider-bookings"],
    queryFn: getMyBookings,
    retry: false,
  });
};

// Get booking details
export const useBookingDetails = (id: string) => {
  return useQuery({
    queryKey: ["provider-booking", id],
    queryFn: () => getBookingDetails(id),
    enabled: !!id,
    retry: false,
  });
};





// Get provider's estimates
export const useMyEstimates = () => {
  return useQuery({
    queryKey: ["provider-estimates"],
    queryFn: getMyEstimates,
    retry: false,
  });
};

// Get estimate details
export const useEstimateDetails = (id: string) => {
  return useQuery({
    queryKey: ["provider-estimate", id],
    queryFn: () => getEstimateDetails(id),
    enabled: !!id,
    retry: false,
  });
};

// Create estimate
export const useCreateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEstimatePayload) =>
      createEstimate(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-estimates"],
      });
    },
  });
};

// Update estimate
export const useUpdateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEstimatePayload;
    }) => updateEstimate(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-estimates"],
      });

      queryClient.invalidateQueries({
        queryKey: ["provider-estimate", variables.id],
      });
    },
  });
};
