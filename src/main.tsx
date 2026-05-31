import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import SignInPage from "./pages/SignInPage.tsx";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient.ts";
import { defaultAdminPath } from "./config/adminNav.ts";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AllergysPage from "./pages/admin/allergys/AllergysPage.tsx";
import AccountsPage from "./pages/admin/accounts/AccountsPage.tsx";
import DiseasesPage from "./pages/admin/diseases/DiseasesPage.tsx";
import EmergencyPage from "./pages/admin/EmergencyPage.tsx";
import KycPage from "./pages/admin/kyc/KycPage.tsx";
import ProfilePage from "./pages/admin/ProfilePage.tsx";
import SymptomsPage from "./pages/admin/SymptomsPage.tsx";

const theme = createTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<SignInPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/dashboard"
                  element={<Navigate to={defaultAdminPath} replace />}
                />
                <Route path="/allergys" element={<AllergysPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/diseases" element={<DiseasesPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/kyc" element={<KycPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/symptoms" element={<SymptomsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
