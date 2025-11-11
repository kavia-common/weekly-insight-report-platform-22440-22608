import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getSupabaseClient } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * AuthSignIn now supports SSO with Supabase OAuth.
 * - Primary: Sign in with Google (real action)
 * - Secondary: Microsoft (disabled placeholder for future)
 * - Shows loading/disabled state and basic error toasts
 * - Keeps routes intact; no backend calls
 */
export default function AuthSignIn() {
  const { mockMode } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseClient();
  const redirectTo =
    (process.env.REACT_APP_FRONTEND_URL || window.location.origin) + "/auth/callback";
  const from = location.state?.from || "/";

  const startGoogleOAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      if (error) {
        showToast(error.message || "Failed to start Google sign-in", "error");
        setLoading(false);
      } else {
        // On success, browser will redirect to the Supabase auth flow.
        // No navigate here since OAuth will take over.
      }
    } catch (e) {
      showToast(e?.message || "Unexpected error starting Google sign-in", "error");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2>Sign In</h2>
      <div className="form" role="group" aria-label="Single Sign-On options">
        {mockMode && (
          <div className="muted" style={{ marginBottom: 8 }}>
            Running in MOCK mode: real SSO will be disabled. Configure REACT_APP_SUPABASE_URL and
            REACT_APP_SUPABASE_ANON_KEY to enable Google sign-in.
          </div>
        )}

        <button
          className="btn btn-primary"
          type="button"
          onClick={startGoogleOAuth}
          disabled={loading || mockMode}
          aria-disabled={loading || mockMode}
          title={mockMode ? "Supabase not configured" : "Continue with Google"}
        >
          {loading ? "Starting Google sign-in…" : "Sign in with Google"}
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <button
            className="btn btn-outline"
            type="button"
            disabled
            title="Coming soon"
            aria-disabled="true"
          >
            Sign in with Microsoft (coming soon)
          </button>
          <span className="muted" aria-hidden>
            • Placeholder only
          </span>
        </div>

        <div className="muted" style={{ marginTop: 12 }}>
          Prefer to continue without signing in?{" "}
          <Link to={from} title="Go back">Go back</Link>
        </div>
      </div>
    </Layout>
  );
}
