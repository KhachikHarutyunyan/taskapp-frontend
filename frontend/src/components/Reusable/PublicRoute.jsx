import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token, isLoading, isUnauthorized } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (token && !isUnauthorized) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;