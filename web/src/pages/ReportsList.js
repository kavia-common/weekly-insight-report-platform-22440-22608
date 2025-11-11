import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Lists reports with local mock filtering and actions.
 * - Tabs: "All" and "My Reports" filter against AuthContext user in MOCK/REAL modes without network calls.
 * - Prominent "New Report" CTA.
 * - Simple empty state with CTA when no reports exist.
 */
export default function ReportsList() {
  const { reports, deleteReport } = useReports();
  const { role, user } = useAuth();
  const [tab, setTab] = useState("all"); // 'all' | 'mine'

  // Filtered list based on selected tab and current user (email as identifier).
  const filtered = useMemo(() => {
    if (tab !== "mine" || !user?.email) return reports;
    return reports.filter((r) => (r.author?.email || "").toLowerCase() === user.email.toLowerCase());
  }, [reports, tab, user]);

  return (
    <Layout>
      <div className="list-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <Link className="btn btn-primary" to="/reports/new">+ New Report</Link>
      </div>

      {/* Secondary nav tabs */}
      <div role="tablist" aria-label="Reports views" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          role="tab"
          aria-selected={tab === "all"}
          className={`btn ${tab === "all" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={tab === "mine"}
          className={`btn ${tab === "mine" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("mine")}
          disabled={!user}
          title={user ? "Show only my reports" : "Sign in (or use mock user) to see 'My Reports'"}
        >
          My Reports
        </button>
      </div>

      <div className="table">
        <div className="row header">
          <div>Title</div>
          <div>Week Of</div>
          <div>Author</div>
          <div>Team</div>
          <div>Actions</div>
        </div>

        {filtered.map((r) => (
          <div className="row" key={r.id}>
            <div><Link to={`/reports/${r.id}`} className="link">{r.title}</Link></div>
            <div>{r.weekOf}</div>
            <div>{r.author?.name}</div>
            <div>{r.team || "-"}</div>
            <div className="row-actions">
              <Link className="btn btn-ghost" to={`/reports/${r.id}`}>Open</Link>
              {(role === "manager" || role === "admin") && (
                <button className="btn btn-outline" onClick={() => deleteReport(r.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="row" style={{ gridTemplateColumns: "1fr" }}>
            <div>
              <div className="muted" style={{ marginBottom: 10 }}>
                {tab === "mine"
                  ? "No reports found for your user."
                  : "No reports yet."}
              </div>
              <Link className="btn btn-primary" to="/reports/new">Create your first report</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
