export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type Role = {
  id: string;
  title: string;
};

export type AccountListItem = {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string | null;
  isBlocked: boolean;
  blockedUntil: string | null;
  isDeleted: boolean;
  deletedOn: string | null;
  roles: Role[];
};

export type AccountFilterParams = {
  page: number;
  pageSize: number;
  roles: string[] | null;
  includeBlocked: boolean;
  includeDeleted: boolean;
  search?: string;
};

export type AccountDetails = {
  name: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  isTwoFactorEnabled: boolean | null;
  isEmailVerified: boolean | null;
  isTemporaryPassword: boolean | null;
  isTemporaryPasswordUsed: boolean | null;
};

export type UpdateAccountRequest = {
  name?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isTwoFactorEnabled?: boolean | null;
  isEmailVerified?: boolean | null;
  isTemporaryPassword?: boolean | null;
  isTemporaryPasswordUsed?: boolean | null;
};

export type CreateAccountRequest = {
  email: string;
  roleIds: string[];
};

export type CreatedAccountResponse = {
  email: string;
  temporaryPassword: string;
};

export type BlockAccountRequest = {
  accountId: string;
  isTemporary: boolean;
  blockUntil?: string | null;
};

export type ResetPasswordRequest = {
  accountId: string;
  passwordResetMethod: number;
};

export type ResetPasswordResponse = {
  email: string;
  temporaryPassword: string;
};

export type EnumValue = {
  id: number;
  name: string;
};
