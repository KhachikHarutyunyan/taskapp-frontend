import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;