import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * AuthContext provides authentication and role handling.
 * - Uses the existing supabaseClient when REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set (REAL mode).
 * - Falls back to MOCK mode only if env is not configured or REACT_APP_MOCK_MODE === 'true'.
 * - In REAL mode, it uses Supabase Auth session and user metadata:
 *    roles: string[] in user_metadata (e.g., ["employee","manager"])
 *    We derive a primary role: 'employee' | 'manager' | 'admin' (default 'employee').
 * OAuth: The Sign In page initiates Google OAuth via Supabase; Microsoft is planned.
 */
const AuthContext = createContext(null);

// Helpers
const DEFAULT_ROLE = "employee";
const ROLE_ORDER = ["admin", "manager", "employee"];
function derivePrimaryRole(meta) {
  const roles = Array.isArray(meta?.roles)
    ? meta.roles
    : meta?.role
    ? [meta.role]
    : [];
  if (!roles || roles.length === 0) return DEFAULT_ROLE;
  // Choose highest privilege found based on ROLE_ORDER priority
  const normalized = roles.map((r) => String(r).toLowerCase());
  for (const r of ROLE_ORDER) {
    if (normalized.includes(r)) return r;
  }
  return DEFAULT_ROLE;
}

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
   * In MOCK mode, uses localStorage for persistence of role and display name.
   * In REAL mode, subscribes to Supabase auth state.
   */
  const supabase = getSupabaseClient();
  const hasSupabaseEnv =
    Boolean(process.env.REACT_APP_SUPABASE_URL) &&
    Boolean(process.env.REACT_APP_SUPABASE_ANON_KEY);
  const envMock = String(process.env.REACT_APP_MOCK_MODE || "").toLowerCase() === "true";
  const [mockMode, setMockMode] = useState(() => envMock || !hasSupabaseEnv);

  // MOCK state
  const [mockRole, setMockRole] = useState(() => localStorage.getItem("mock_role") || DEFAULT_ROLE);
  const [mockUser, setMockUser] = useState(() => {
    const saved = localStorage.getItem("mock_user");
    return saved ? JSON.parse(saved) : { name: "Alex Johnson", email: "alex@example.com" };
  });

  // REAL state (Supabase)
  const [session, setSession] = useState(null);
  const [sbUser, setSbUser] = useState(null); // supabase user object

  // Persist MOCK
  useEffect(() => {
    if (!mockMode) return;
    localStorage.setItem("mock_role", mockRole);
  }, [mockMode, mockRole]);
  useEffect(() => {
    if (!mockMode) return;
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
  }, [mockMode, mockUser]);

  // Subscribe to Supabase auth state in REAL mode
  useEffect(() => {
    if (mockMode) return;
    let active = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setSession(data?.session || null);
        setSbUser(data?.session?.user || null);
      } catch (e) {
        console.warn("Supabase getSession failed:", e);
      }
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setSbUser(newSession?.user || null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockMode]);

  // PUBLIC API surface
  const value = useMemo(() => {
    // helper to check manager/admin
    const isManagerOrAdmin = (r) => r === "manager" || r === "admin";

    if (mockMode) {
      const canSeeAISummary = isManagerOrAdmin(mockRole);
      return {
        mockMode: true,
        role: mockRole,
        roles: [mockRole],
        user: mockUser,
        session: null,
        // PUBLIC_INTERFACE
        canSeeAISummary, // visible only in mock mode when role is manager/admin
        // PUBLIC_INTERFACE
        setRole: setMockRole, // Set 'employee' | 'manager' | 'admin'
        // PUBLIC_INTERFACE
        setUser: setMockUser, // Update mock user profile
        // PUBLIC_INTERFACE
        signOut: () => {
          setMockUser(null);
        },
        // PUBLIC_INTERFACE
        signIn: (name = "Alex Johnson", email = "alex@example.com") => {
          setMockUser({ name, email });
        },
        // PUBLIC_INTERFACE
        signInWithPassword: async () => {
          // Not applicable in mock mode; return a soft error.
          return { error: new Error("Auth disabled in MOCK mode") };
        },
        // PUBLIC_INTERFACE
        signUpWithPassword: async () => {
          return { error: new Error("Auth disabled in MOCK mode") };
        },
      };
    }

    // REAL mode (Supabase)
    const meta = sbUser?.user_metadata || {};
    const primaryRole = derivePrimaryRole(meta);
    const displayUser =
      sbUser
        ? {
            name: meta?.full_name || meta?.name || sbUser.email?.split("@")[0] || "User",
            email: sbUser.email || "",
          }
        : null;

    // In REAL mode, keep placeholder hidden until real AI integration lands
    const canSeeAISummary = false;

    return {
      mockMode: false,
      role: primaryRole,
      roles: Array.isArray(meta?.roles) && meta.roles.length > 0 ? meta.roles : [primaryRole],
      user: displayUser,
      session,
      // PUBLIC_INTERFACE
      canSeeAISummary, // explicitly exposed; false in REAL mode
      // PUBLIC_INTERFACE
      setRole: () => {
        // For REAL mode, UI can manage role locally via Settings until backend exists.
        // We keep this NO-OP to prevent accidental role change in metadata without a backend.
        console.info("Role changes are simulated locally until backend is ready.");
      },
      // PUBLIC_INTERFACE
      setUser: () => {
        console.info("Direct user profile updates are not supported yet.");
      },
      // PUBLIC_INTERFACE
      signOut: async () => {
        await supabase.auth.signOut();
      },
      // PUBLIC_INTERFACE
      signIn: async () => {
        // Kept for backward compatibility (used by Header prior to UI routes).
        // Suggest using signInWithPassword via the /auth/login page.
        console.info("Use signInWithPassword from the Sign In page.");
      },
      // PUBLIC_INTERFACE
      signInWithPassword: async ({ email, password }) => {
        return await supabase.auth.signInWithPassword({ email, password });
      },
      // PUBLIC_INTERFACE
      signUpWithPassword: async ({ email, password }) => {
        // Default roles to ['employee'] in metadata
        return await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { roles: ["employee"] },
            emailRedirectTo: process.env.REACT_APP_FRONTEND_URL || window.location.origin,
          },
        });
      },
    };
  }, [mockMode, mockRole, mockUser, sbUser, session, supabase]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
