import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthenticatedUserRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

export default AuthenticatedUserRoute;
