import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  ADMIN_TOKEN_STORAGE_KEY,
} from "../api/adminApi";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  const adminToken =
    localStorage.getItem(
      ADMIN_TOKEN_STORAGE_KEY,
    );

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}