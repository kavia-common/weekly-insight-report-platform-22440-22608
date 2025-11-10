import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleToggle from "../RoleToggle";

/**
 * Top header with user info and quick actions.
 */
export default function Header() {
  const { user, signOut, signIn } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <div className="page-title">
          {pathname === "/" && "Dashboard"}
          {pathname.startsWith("/reports") && "Reports"}
          {pathname.startsWith("/history") && "History"}
          {pathname.startsWith("/settings") && "Settings"}
        </div>
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
            <button className="btn btn-ghost" onClick={signOut} title="Mock Sign Out">Sign out</button>
          </div>
        ) : (
          <button className="btn btn-outline" onClick={() => signIn()} title="Mock Sign In">Sign in</button>
        )}
      </div>
    </header>
  );
}
