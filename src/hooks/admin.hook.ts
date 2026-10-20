import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createService,
  deleteCategory,
  deleteService,
  getAllCategories,
  getAllProviders,
  getAllServices,
  getAllUsers,
  unverifyProvider,
  updateCategory,
  updateService,
  verifyProvider,
} from "@/api/admin.api";

export function useGetAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: false,
  });
}

export function useGetAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    retry: false,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useGetAllServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
    retry: false,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}


export function useGetAllProviders() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: getAllProviders,
    retry: false,
  });
}


export function useVerifyProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyProvider,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["providers"] }),
  });
}

export function useUnverifyProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unverifyProvider,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["providers"] }),
  });
}
