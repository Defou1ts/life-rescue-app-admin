import {
  changeEmail,
  changePassword,
  fetchProfile,
  profileKeys,
  sendChangeEmailOtp,
  sendPasswordRecoveryOtp,
  updateProfile,
} from "@/api/profile/profileApi";
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/api/profile/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: fetchProfile,
  });
}

function useInvalidateProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: profileKeys.all });
}

export function useUpdateProfile() {
  const invalidate = useInvalidateProfile();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: invalidate,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  });
}

export function useSendPasswordRecoveryOtp() {
  return useMutation({
    mutationFn: (email: string) => sendPasswordRecoveryOtp(email),
  });
}

export function useSendChangeEmailOtp() {
  return useMutation({
    mutationFn: (email: string) => sendChangeEmailOtp(email),
  });
}

export function useChangeEmail() {
  const invalidate = useInvalidateProfile();

  return useMutation({
    mutationFn: (payload: ChangeEmailRequest) => changeEmail(payload),
    onSuccess: invalidate,
  });
}
