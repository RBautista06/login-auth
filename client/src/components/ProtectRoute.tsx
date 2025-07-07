import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: ReactNode;
}

const ProtectRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectRoute;
