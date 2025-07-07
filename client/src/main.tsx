import { StrictMode, useEffect, useRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { VerificationEmailPage } from "./pages/VerificationEmailPage";
import { useAuthStore } from "./store/authStore";
import Homepage from "./pages/Homepage";
import ProtectRoute from "./components/ProtectRoute";
import Dashboard from "./pages/Dashboard";
import AuthenticatedUserRoute from "./components/AuthenticatedUserRoute";
import ForgotPasswordPage from "./pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Homepage />
      </ProtectRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectRoute>
        <Dashboard />
      </ProtectRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthenticatedUserRoute>
        <SignUpPage />
      </AuthenticatedUserRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthenticatedUserRoute>
        <LoginPage />
      </AuthenticatedUserRoute>
    ),
  },
  {
    path: "/verify-email",
    element: <VerificationEmailPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function AppWrapper() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("user:", user);
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
  return <RouterProvider router={router} />;
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
