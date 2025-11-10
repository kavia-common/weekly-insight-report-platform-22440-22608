import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * PUBLIC_INTERFACE
 * AuthSignUp provides email/password registration using Supabase when not in mock mode.
 * It sets default user_metadata.roles = ['employee'].
 * Note: Depending on Supabase email confirmation settings, user may need to confirm email.
 * TODO: Add OAuth providers and profile enrichment later.
 */
export default function AuthSignUp() {
  const { signUpWithPassword, mockMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (mockMode) {
      showToast("MOCK mode: Sign Up is disabled", "info");
      navigate("/", { replace: true });
      return;
    }
    const { error } = await signUpWithPassword({ email, password });
    if (error) {
      showToast(error.message || "Failed to sign up", "error");
    } else {
      showToast("Sign up successful. Check your email (if confirmation is enabled).", "success");
      navigate("/", { replace: true });
    }
  }

  return (
    <Layout>
      <h2>Create Account</h2>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Sign Up</button>
          <Link to="/" className="btn btn-ghost" type="button">Cancel</Link>
        </div>
        <div className="muted">
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </div>
      </form>
    </Layout>
  );
}
