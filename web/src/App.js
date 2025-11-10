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

/**
 * PUBLIC_INTERFACE
 * App defines top-level routes for the mock UI.
 * Routes:
 *   /                - Dashboard
 *   /reports         - List
 *   /reports/new     - Create
 *   /reports/:id     - Detail
 *   /history         - History
 *   /settings        - Settings
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<ReportsList />} />
      <Route path="/reports/new" element={<ReportNew />} />
      <Route path="/reports/:id" element={<ReportDetail />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
