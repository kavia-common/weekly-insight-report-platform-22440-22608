import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Report detail page with AI summary placeholder and export/share toasts.
 */
export default function ReportDetail() {
  const { id } = useParams();
  const { getReport, updateReport, deleteReport, generateMockSummary } = useReports();
  const { role, canSeeAISummary, mockMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const report = getReport(id);
  const [title, setTitle] = useState(report?.title || "");
  const [team, setTeam] = useState(report?.team || "");
  const [weekOf, setWeekOf] = useState(report?.weekOf || "");
  const [acc, setAcc] = useState((report?.accomplishments || []).join("\n"));
  const [bl, setBl] = useState((report?.blockers || []).join("\n"));
  const [pl, setPl] = useState((report?.plans || []).join("\n"));

  const canEdit = useMemo(() => role === "manager" || role === "admin" || role === "employee", [role]);

  if (!report) {
    return (
      <Layout>
        <div className="muted">Report not found.</div>
      </Layout>
    );
  }

  const save = () => {
    updateReport(report.id, {
      title: title || "Untitled report",
      team: team || "General",
      weekOf,
      accomplishments: acc.split("\n").filter(Boolean),
      blockers: bl.split("\n").filter(Boolean),
      plans: pl.split("\n").filter(Boolean),
    });
    showToast("Report updated", "success");
  };

  const genSummary = () => {
    generateMockSummary(report.id);
    showToast("AI summary generated (mock)", "success");
  };

  const exportPdf = () => {
    // placeholder only
    showToast("Export to PDF triggered (mock)", "info");
  };

  const share = () => {
    // placeholder only
    showToast("Share via email/Slack (mock)", "info");
  };

  const remove = () => {
    deleteReport(report.id);
    showToast("Report deleted", "success");
    navigate("/reports");
  };

  return (
    <Layout>
      <div className="detail-header">
        <h2>Report Detail</h2>
        <div className="detail-actions">
          <button className="btn btn-outline" onClick={exportPdf}>Export</button>
          <button className="btn btn-outline" onClick={share}>Share</button>
          {(role === "manager" || role === "admin") && (
            <button className="btn btn-danger" onClick={remove}>Delete</button>
          )}
          <button className="btn btn-primary" onClick={save} disabled={!canEdit}>Save</button>
        </div>
      </div>

      <form className="form">
        <div className="form-grid">
          <label>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} />
          </label>
          <label>
            <span>Team</span>
            <input value={team} onChange={(e) => setTeam(e.target.value)} disabled={!canEdit} />
          </label>
          <label>
            <span>Week Of</span>
            <input type="date" value={weekOf} onChange={(e) => setWeekOf(e.target.value)} disabled={!canEdit} />
          </label>
        </div>

        <label>
          <span>Accomplishments</span>
          <textarea rows={5} value={acc} onChange={(e) => setAcc(e.target.value)} disabled={!canEdit} />
        </label>
        <label>
          <span>Blockers</span>
          <textarea rows={4} value={bl} onChange={(e) => setBl(e.target.value)} disabled={!canEdit} />
        </label>
        <label>
          <span>Plans</span>
          <textarea rows={4} value={pl} onChange={(e) => setPl(e.target.value)} disabled={!canEdit} />
        </label>
      </form>

      {canSeeAISummary && (
        <section className="ai-summary">
          <div className="ai-header">
            <h3>AI Summary (placeholder)</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={genSummary}
                disabled={!mockMode}
                title={mockMode ? "Generate mock summary" : "Available in MOCK mode only"}
              >
                {mockMode ? "Generate Summary" : "Generate (disabled)"}
              </button>
              {!mockMode && <span className="muted" aria-hidden>⏳</span>}
            </div>
          </div>
          <div className={`ai-box ${report.aiSummary ? "" : "muted"}`}>
            {report.aiSummary || "No summary yet. Click Generate to create a mock summary."}
          </div>
          <div className="ai-note">
            This is a placeholder shown to managers/admins in mock mode. Real AI summaries will be integrated later.
          </div>
        </section>
      )}
    </Layout>
  );
}
