import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RoleRedirect() {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role === "SUPERADMIN") return <Navigate to="/admin" replace />;

  return <Navigate to="/dashboard" replace />;
}
