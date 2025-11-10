import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * PUBLIC_INTERFACE
 * AuthSignIn provides email/password sign-in using Supabase when not in mock mode.
 * In MOCK mode, this page explains that auth is disabled and suggests toggling mock sign-in via header (legacy).
 * TODO: Add OAuth buttons for Google/Microsoft once enabled via Supabase.
 */
export default function AuthSignIn() {
  const { signInWithPassword, mockMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (mockMode) {
      showToast("MOCK mode: Email/Password is disabled", "info");
      navigate(from, { replace: true });
      return;
    }
    const { error } = await signInWithPassword({ email, password });
    if (error) {
      showToast(error.message || "Failed to sign in", "error");
    } else {
      showToast("Signed in", "success");
      navigate(from, { replace: true });
    }
  }

  return (
    <Layout>
      <h2>Sign In</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Sign In</button>
          <Link to="/" className="btn btn-ghost" type="button">Cancel</Link>
        </div>

        <div className="muted">
          New here? <Link to="/auth/signup">Create an account</Link>
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          TODO: OAuth providers (Google/Microsoft) via Supabase.
        </div>
      </form>
    </Layout>
  );
}
