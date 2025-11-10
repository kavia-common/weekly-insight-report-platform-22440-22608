import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Lists all reports with simple role-aware actions.
 */
export default function ReportsList() {
  const { reports, deleteReport } = useReports();
  const { role } = useAuth();

  return (
    <Layout>
      <div className="list-header">
        <h2>Reports</h2>
        <Link className="btn btn-primary" to="/reports/new">+ New Report</Link>
      </div>

      <div className="table">
        <div className="row header">
          <div>Title</div>
          <div>Week Of</div>
          <div>Author</div>
          <div>Team</div>
          <div>Actions</div>
        </div>
        {reports.map((r) => (
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
        {reports.length === 0 && (
          <div className="row">
            <div className="muted">No reports yet.</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
