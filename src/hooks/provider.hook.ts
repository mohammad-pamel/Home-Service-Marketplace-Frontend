
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProviderProfile,
  getMyProviderProfile,
  updateProviderProfile,
} from "@/api/provider.api";

import type { ProviderProfilePayload } from "@/types/provider.type";

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
