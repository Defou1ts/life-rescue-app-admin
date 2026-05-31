import { axiosInstance } from "@/api/axiosInstance";
import type {
  AccountDetails,
  AccountFilterParams,
  AccountListItem,
  BlockAccountRequest,
  CreateAccountRequest,
  CreatedAccountResponse,
  EnumValue,
  PagedResult,
  ResetPasswordRequest,
  ResetPasswordResponse,
  Role,
  UpdateAccountRequest,
} from "./types";

export const accountKeys = {
  filtered: (params: AccountFilterParams) =>
    [
      "accounts",
      "filtered",
      params.page,
      params.pageSize,
      params.roles ? [...params.roles].sort().join(",") : "null",
      params.includeBlocked,
      params.includeDeleted,
      params.search ?? "",
    ] as const,
  detail: (accountId: string) => ["accounts", "detail", accountId] as const,
  roles: ["roles"] as const,
  passwordResetMethods: ["password-reset-methods"] as const,
};

function buildFilterBody(params: AccountFilterParams) {
  return {
    page: params.page,
    pageSize: params.pageSize,
    roles: params.roles && params.roles.length > 0 ? params.roles : null,
    includeBlocked: params.includeBlocked,
    includeDeleted: params.includeDeleted,
    search: params.search ?? "",
  };
}

export const fetchFilteredAccounts = async (params: AccountFilterParams) => {
  const { data } = await axiosInstance.post<PagedResult<AccountListItem>>(
    "/accounts/filtered",
    buildFilterBody(params),
  );
  return data;
};

export const fetchAccountById = async (accountId: string) => {
  const { data } = await axiosInstance.get<AccountDetails>(
    `/accounts/${accountId}`,
  );
  return data;
};

export const createAccount = async (payload: CreateAccountRequest) => {
  const { data } = await axiosInstance.post<CreatedAccountResponse>(
    "/accounts",
    payload,
  );
  return data;
};

export const updateAccount = async (
  accountId: string,
  payload: UpdateAccountRequest,
) => {
  await axiosInstance.patch(`/accounts/${accountId}`, payload);
};

export const deleteAccount = async (accountId: string) => {
  await axiosInstance.delete(`/accounts/${accountId}`);
};

export const softDeleteAccount = async (accountId: string) => {
  await axiosInstance.delete(`/accounts/soft/${accountId}`);
};

export const blockAccount = async (payload: BlockAccountRequest) => {
  await axiosInstance.post("/accounts/block", payload);
};

export const unblockAccount = async (accountId: string) => {
  await axiosInstance.post(`/accounts/unblock/${accountId}`);
};

export const resetAccountPassword = async (payload: ResetPasswordRequest) => {
  const { data } = await axiosInstance.post<ResetPasswordResponse | null>(
    "/accounts/password",
    payload,
  );
  return data;
};

export const fetchRoles = async () => {
  const { data } = await axiosInstance.get<Role[]>("/role");
  return data;
};

export const fetchPasswordResetMethods = async () => {
  const { data } = await axiosInstance.get<EnumValue[]>(
    "/reference/available-values/reset-password-method",
  );
  return data;
};
