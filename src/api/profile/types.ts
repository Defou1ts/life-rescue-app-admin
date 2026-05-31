export type Profile = {
  name: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  isTwoFactorEnabled: boolean;
  isNeedToChangePassword: boolean;
};

export type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  isTwoFactorEnabled: boolean;
  phoneNumber: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangeEmailRequest = {
  newEmail: string;
  token: string;
};
