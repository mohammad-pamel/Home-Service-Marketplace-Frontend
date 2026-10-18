import { createCategory, deleteCategory, getAllCategories, getAllUsers, updateCategory } from "@/api/admin.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        retry: false
    })
}

export function useGetAllCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        retry: false
    })
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
    mutationFn: () => updateCategory(),
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