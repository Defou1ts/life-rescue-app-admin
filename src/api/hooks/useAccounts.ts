import {
  accountKeys,
  blockAccount,
  createAccount,
  deleteAccount,
  fetchAccountById,
  fetchFilteredAccounts,
  fetchPasswordResetMethods,
  fetchRoles,
  resetAccountPassword,
  softDeleteAccount,
  unblockAccount,
  updateAccount,
} from "@/api/account/accountApi";
import type {
  AccountFilterParams,
  BlockAccountRequest,
  CreateAccountRequest,
  ResetPasswordRequest,
  UpdateAccountRequest,
} from "@/api/account/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccountsList(params: AccountFilterParams) {
  return useQuery({
    queryKey: accountKeys.filtered(params),
    queryFn: () => fetchFilteredAccounts(params),
  });
}

export function useAccountDetails(accountId: string | null) {
  return useQuery({
    queryKey: accountKeys.detail(accountId ?? ""),
    queryFn: () => fetchAccountById(accountId!),
    enabled: accountId !== null,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: accountKeys.roles,
    queryFn: fetchRoles,
    staleTime: 5 * 60_000,
  });
}

export function usePasswordResetMethods(enabled = false) {
  return useQuery({
    queryKey: accountKeys.passwordResetMethods,
    queryFn: fetchPasswordResetMethods,
    enabled,
    staleTime: 5 * 60_000,
  });
}

function useInvalidateAccounts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };
}

export function useCreateAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) => createAccount(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: UpdateAccountRequest;
    }) => updateAccount(accountId, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onSuccess: invalidate,
  });
}

export function useSoftDeleteAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: (accountId: string) => softDeleteAccount(accountId),
    onSuccess: invalidate,
  });
}

export function useBlockAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: (payload: BlockAccountRequest) => blockAccount(payload),
    onSuccess: invalidate,
  });
}

export function useUnblockAccount() {
  const invalidate = useInvalidateAccounts();

  return useMutation({
    mutationFn: (accountId: string) => unblockAccount(accountId),
    onSuccess: invalidate,
  });
}

export function useResetAccountPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetAccountPassword(payload),
  });
}
