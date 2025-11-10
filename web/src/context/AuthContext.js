import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * AuthContext provides a local-only mock authentication and role toggle.
 * Roles: 'employee' | 'manager' | 'admin'
 * Note: This is a mock and performs no network calls.
 * TODO: Replace with Supabase Auth integration.
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns the current auth context value. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides auth state and actions to descendants.
   * This is a mock; uses localStorage for persistence of role and display name.
   */
  const [role, setRole] = useState(() => {
    return localStorage.getItem("mock_role") || "employee";
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mock_user");
    return saved ? JSON.parse(saved) : { name: "Alex Johnson", email: "alex@example.com" };
  });

  useEffect(() => {
    localStorage.setItem("mock_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("mock_user", JSON.stringify(user));
  }, [user]);

  const value = useMemo(
    () => ({
      role,
      user,
      // PUBLIC_INTERFACE
      setRole, // Set one of 'employee' | 'manager' | 'admin'
      // PUBLIC_INTERFACE
      setUser, // Update mock user profile
      // PUBLIC_INTERFACE
      signOut: () => {
        // Mock sign-out
        // TODO: Replace with Supabase Auth signOut()
        setUser(null);
      },
      // PUBLIC_INTERFACE
      signIn: (name = "Alex Johnson", email = "alex@example.com") => {
        // Mock sign-in
        // TODO: Replace with Supabase Auth signInWithOAuth()
        setUser({ name, email });
      },
    }),
    [role, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
