import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * PUBLIC_INTERFACE
 * Create a new weekly report using in-memory store.
 */
export default function ReportNew() {
  const { createReport } = useReports();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [weekOf, setWeekOf] = useState("");
  const [team, setTeam] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plans, setPlans] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = createReport({
      title: title || "Untitled report",
      weekOf: weekOf || new Date().toISOString().slice(0, 10),
      team: team || "General",
      accomplishments: accomplishments.split("\n").filter(Boolean),
      blockers: blockers.split("\n").filter(Boolean),
      plans: plans.split("\n").filter(Boolean),
      author: user || { name: "Unknown", email: "unknown@example.com" },
    });
    showToast("Report created", "success");
    navigate(`/reports/${report.id}`);
  };

  return (
    <Layout>
      <h2>Create New Report</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 4 Progress" />
          </label>
          <label>
            <span>Week Of</span>
            <input type="date" value={weekOf} onChange={(e) => setWeekOf(e.target.value)} />
          </label>
          <label>
            <span>Team</span>
            <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Platform" />
          </label>
        </div>
        <label>
          <span>Accomplishments (one per line)</span>
          <textarea rows={5} value={accomplishments} onChange={(e) => setAccomplishments(e.target.value)} />
        </label>
        <label>
          <span>Blockers (one per line)</span>
          <textarea rows={4} value={blockers} onChange={(e) => setBlockers(e.target.value)} />
        </label>
        <label>
          <span>Plans (one per line)</span>
          <textarea rows={4} value={plans} onChange={(e) => setPlans(e.target.value)} />
        </label>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Create</button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </Layout>
  );
}
