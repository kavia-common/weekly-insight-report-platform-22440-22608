import React from "react";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";

/**
 * PUBLIC_INTERFACE
 * Settings to toggle persistence and show integration TODOs.
 */
export default function Settings() {
  const { persist, setPersistence } = useReports();

  return (
    <Layout>
      <h2>Settings</h2>
      <div className="settings">
        <label className="switch">
          <input
            type="checkbox"
            checked={persist}
            onChange={(e) => setPersistence(e.target.checked)}
          />
          <span>Persist reports to localStorage</span>
        </label>

        <div className="integration-todos">
          <h3>Upcoming Integrations (TODO)</h3>
          <ul>
            <li>Supabase Auth for SSO and user sessions</li>
            <li>Supabase Database for persistent reports</li>
            <li>Supabase Storage for attachments</li>
            <li>Supabase Functions for AI summary generation</li>
            <li>Export to PDF/Excel and share to Slack/Teams</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
