import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return <div>로딩중...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const roles = user.roles || [];
  const ok = allowedRoles.some(r => roles.includes(r));
  if (!ok) return <Navigate to="/" replace />;

  return <Outlet />;
}