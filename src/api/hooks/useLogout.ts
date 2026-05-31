import { logout } from "@/api/logout";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSettled: () => {
      navigate("/", { replace: true });
    },
  });
};
