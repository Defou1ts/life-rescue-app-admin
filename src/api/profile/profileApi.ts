import { axiosInstance } from "@/api/axiosInstance";
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  Profile,
  UpdateProfileRequest,
} from "./types";

export const profileKeys = {
  all: ["profile"] as const,
};

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get<Profile>("/profile");
  return data;
};

export const updateProfile = async (payload: UpdateProfileRequest) => {
  await axiosInstance.put("/profile", payload);
};

export const changePassword = async (payload: ChangePasswordRequest) => {
  await axiosInstance.put("/profile/password", payload);
};

export const sendPasswordRecoveryOtp = async (email: string) => {
  await axiosInstance.put("/profile/password/recovery", null, {
    params: { email },
  });
};

export const sendChangeEmailOtp = async (email: string) => {
  await axiosInstance.post("/profile/email", null, {
    params: { email },
  });
};

export const changeEmail = async (payload: ChangeEmailRequest) => {
  await axiosInstance.put("/profile/email", payload);
};
