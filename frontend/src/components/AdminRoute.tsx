import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (user && user.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
