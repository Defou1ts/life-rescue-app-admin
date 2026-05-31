import { tokenStorage } from "@/store/tokenStorage";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const token = tokenStorage.getAccessToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const token = tokenStorage.getAccessToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
