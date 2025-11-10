import React from "react";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";

/**
 * PUBLIC_INTERFACE
 * History page showing chronological activity (mock).
 */
export default function History() {
  const { reports } = useReports();

  const sorted = [...reports].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <Layout>
      <h2>History</h2>
      <div className="timeline">
        {sorted.map((r) => (
          <div className="timeline-item" key={r.id}>
            <div className="dot" />
            <div className="event">
              <div className="event-title">{r.title}</div>
              <div className="event-meta">
                Updated {new Date(r.updatedAt).toLocaleString()} • Week of {r.weekOf} • {r.author?.name}
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <div className="muted">No history yet.</div>}
      </div>
    </Layout>
  );
}
