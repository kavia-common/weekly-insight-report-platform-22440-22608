import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `nav-item ${isActive ? "active" : ""}`;

/**
 * Sidebar navigation following Ocean Professional theme.
 */
export default function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">DT3</div>
        <div className="brand-name">DigitalT3</div>
      </div>
      <nav className="nav">
        <NavLink end to="/" className={navLinkClass}>
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/reports" className={navLinkClass}>
          <span>📄</span> Reports
        </NavLink>
        <NavLink to="/history" className={navLinkClass}>
          <span>🕓</span> History
        </NavLink>
        <NavLink to="/settings" className={navLinkClass}>
          <span>⚙️</span> Settings
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="role-pill">Role: {role}</div>
        <div className="note">Mock UI • No network</div>
      </div>
    </aside>
  );
}
