import { forgotPassword, getMe, googleOAuth, resetPassword, userLogin, userLogout, userRegistration, verifyAccount } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}

// export function useLogin() {
//   return useMutation({
//     mutationFn: userLogin,
//   });
// }

export function useVerifyAccount() {
    return useMutation({
        mutationFn: verifyAccount,
    })
}

export function useRegistration() {
    return useMutation({
        mutationFn: userRegistration,
    })
}

export function useLogout() {
    return useMutation({
        mutationFn: userLogout,
    })
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useGetMe() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false
    })
}

// export function useGetMe() {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: getMe,
//     retry: false,
//     staleTime: 0,
//   });
// }
// export function useGetMe() {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: getMe,
//     retry: false,
//     staleTime: 60 * 1000,
//   });
// }


export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}


export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}