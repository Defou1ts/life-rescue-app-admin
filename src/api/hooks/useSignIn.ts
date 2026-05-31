import { defaultAdminPath } from "@/config/adminNav";
import { tokenStorage } from "@/store/tokenStorage";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { axiosInstance } from "../axiosInstance";
import type { ServerError } from "../types";

export type SignInRequestData = {
  email: string;
  password: string;
  token?: string;
};

export interface SignInResponseData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  createdAt: string;
}

export const signIn = async (data: SignInRequestData) => {
  return axiosInstance.post<SignInResponseData>("/auth/login", data);
};

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation<
    AxiosResponse<SignInResponseData>,
    ServerError,
    SignInRequestData
  >({
    mutationKey: ["sign-in"],
    mutationFn: signIn,

    onSuccess: async (data, { email, password }) => {
      if (data.status === 202) {
        navigate("/verification", {
          state: { email, password },
        });
        return;
      }

      if (data.status === 200) {
        const { access_token, refresh_token } = data.data;

        tokenStorage.setTokens(access_token, refresh_token);

        navigate(defaultAdminPath, { replace: true });
      }
    },
  });
};
