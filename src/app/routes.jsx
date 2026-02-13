import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute.jsx";

import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Seo from "../pages/Seo.jsx";
import Geo from "../pages/Geo.jsx";
import RoleRedirect from "../routes/RoleRedirect.jsx";
import AdminPage from "../pages/AdminPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />

      <Route path="/login" element={<Login />} />

      {/* ADMIN area */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seo" element={<Seo />} />
          <Route path="/geo" element={<Geo />} />
        </Route>
      </Route>

      {/* SUPERADMIN area */}
      <Route element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
