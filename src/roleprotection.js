import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./sections/login/auth";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauth" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
