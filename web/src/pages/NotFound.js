import React from "react";
import Layout from "../components/Layout/Layout";

/**
 * PUBLIC_INTERFACE
 * Generic 404 fallback.
 */
export default function NotFound() {
  return (
    <Layout>
      <div className="muted">Page not found.</div>
    </Layout>
  );
}
