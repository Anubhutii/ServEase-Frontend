import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "../Context/RoleContext";
import { useAuth } from "../Context/AuthContext";

// Wraps all user-only routes — redirects to /provider-dashboard if in provider mode
export const UserOnlyLayout = () => {
  const { activeRole } = useRole();
  const { loading } = useAuth();
  if (loading) return null;
  if (activeRole === "provider") return <Navigate to="/provider-dashboard" replace />;
  return <Outlet />;
};

// Protects /provider-dashboard — redirects to / if not in provider mode
export const ProviderGuard = ({ children }: { children: React.ReactNode }) => {
  const { activeRole } = useRole();
  const { loading } = useAuth();
  if (loading) return null;
  if (activeRole !== "provider") return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default UserOnlyLayout;
