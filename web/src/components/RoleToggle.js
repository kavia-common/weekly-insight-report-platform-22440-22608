import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * RoleToggle allows switching the local mock role.
 */
export default function RoleToggle() {
  const { role, setRole } = useAuth();

  return (
    <div className="role-toggle">
      <label htmlFor="role" className="sr-only">Role</label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="select"
        aria-label="Select mock role"
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
