import { axiosInstance } from "@/api/axiosInstance";
import { queryClient } from "@/config/queryClient";
import { tokenStorage } from "@/store/tokenStorage";

export const logout = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();

    if (refreshToken) {
      await axiosInstance.post("/auth/logout", { refreshToken });
    }
  } catch (e) {
    console.error("LOGOUT_REQUEST_ERROR", e);
  } finally {
    tokenStorage.clearTokens();
    delete axiosInstance.defaults.headers.common.Authorization;
    queryClient.clear();
  }
};
