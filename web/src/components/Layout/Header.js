import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleToggle from "../RoleToggle";

/**
 * Top header with user info and quick actions.
 */
export default function Header() {
  const { user, signOut, mockMode } = useAuth();
  const { pathname } = useLocation();

  const navLinkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  return (
    <header className="header">
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="page-title">
          {pathname === "/" && "Dashboard"}
          {pathname.startsWith("/reports") && "Reports"}
          {pathname.startsWith("/history") && "History"}
          {pathname.startsWith("/settings") && "Settings"}
        </div>
        {/* Simple top-level nav for quick access, includes Reports */}
        <nav className="nav" aria-label="Primary" style={{ display: "flex", gap: 6, marginLeft: 16 }}>
          <NavLink end to="/" className={navLinkClass}>
            <span aria-hidden>🏠</span> <span className="sr-only">Go to </span>Dashboard
          </NavLink>
          <NavLink to="/reports" className={navLinkClass}>
            <span aria-hidden>📄</span> <span className="sr-only">Go to </span>Reports
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            <span aria-hidden>🕓</span> <span className="sr-only">Go to </span>History
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            <span aria-hidden>⚙️</span> <span className="sr-only">Go to </span>Settings
          </NavLink>
        </nav>
      </div>
      <div className="header-right">
        <Link to="/reports/new" className="btn btn-primary">+ New Report</Link>
        <RoleToggle />
        {user ? (
          <div className="user-chip">
            <div className="avatar" aria-hidden>👤</div>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button className="btn btn-ghost" onClick={signOut} title="Sign Out">Sign out</button>
          </div>
        ) : (
          <Link to="/auth/login" className="btn btn-outline" title={mockMode ? "Mock Sign In" : "Sign In"}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
