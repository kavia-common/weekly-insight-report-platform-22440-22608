import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import ReportsList from "./pages/ReportsList";
import ReportNew from "./pages/ReportNew";
import ReportDetail from "./pages/ReportDetail";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthSignIn from "./pages/AuthSignIn";
import AuthSignUp from "./pages/AuthSignUp";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * PUBLIC_INTERFACE
 * App defines top-level routes for the UI.
 * Routes:
 *   /                - Dashboard (public)
 *   /reports         - List (public)
 *   /reports/new     - Create (protected)
 *   /reports/:id     - Detail (public for now to avoid breaking existing flows)
 *   /history         - History (public)
 *   /settings        - Settings (public; role switches simulated locally)
 *   /auth/login      - Sign In
 *   /auth/signup     - Sign Up
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<ReportsList />} />
      <Route
        path="/reports/new"
        element={
          <ProtectedRoute>
            <ReportNew />
          </ProtectedRoute>
        }
      />
      <Route path="/reports/:id" element={<ReportDetail />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/auth/login" element={<AuthSignIn />} />
      <Route path="/auth/signup" element={<AuthSignUp />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
