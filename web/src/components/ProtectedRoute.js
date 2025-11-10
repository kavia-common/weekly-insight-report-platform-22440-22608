import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards children behind authentication.
 * - In MOCK mode, it treats any mock "signed-in" user (non-null) as authenticated.
 * - In REAL mode, it requires a Supabase session.
 * Usage:
 *  <ProtectedRoute><SomePage /></ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const { mockMode, user, session } = useAuth();
  const { pathname } = useLocation();

  const authed = mockMode ? Boolean(user) : Boolean(session);
  if (!authed) {
    return <Navigate to="/auth/login" state={{ from: pathname }} replace />;
  }
  return children;
}
