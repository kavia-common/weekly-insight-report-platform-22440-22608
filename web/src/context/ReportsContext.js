import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

/**
 * PUBLIC_INTERFACE
 * ReportsContext handles in-memory CRUD for weekly reports with optional localStorage persistence.
 * Each report:
 *  {
 *    id: string,
 *    title: string,
 *    weekOf: string (YYYY-MM-DD),
 *    accomplishments: string[],
 *    blockers: string[],
 *    plans: string[],
 *    author: { name, email },
 *    team?: string,
 *    createdAt: string (ISO),
 *    updatedAt: string (ISO),
 *    aiSummary?: string
 *  }
 * Note: No backend calls here.
 * TODO: Replace with Supabase DB + Storage integration.
 */

const ReportsContext = createContext(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function nowISO() {
  return new Date().toISOString();
}

const initialState = {
  reports: [],
  persist: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, reports: action.payload || [] };
    case "CREATE": {
      const reports = [action.payload, ...state.reports];
      return { ...state, reports };
    }
    case "UPDATE": {
      const reports = state.reports.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload, updatedAt: nowISO() } : r));
      return { ...state, reports };
    }
    case "DELETE": {
      const reports = state.reports.filter((r) => r.id !== action.payload);
      return { ...state, reports };
    }
    case "TOGGLE_PERSIST":
      return { ...state, persist: action.payload };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function useReports() {
  /** Returns the ReportsContext value for CRUD and list access. */
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within ReportsProvider");
  return ctx;
}

// Seed some demo data
function seedData() {
  const base = [
    {
      id: uid(),
      title: "Week of Acme Project Kickoff",
      weekOf: "2025-01-06",
      accomplishments: ["Completed project kickoff", "Aligned on milestones", "Drafted first sprint backlog"],
      blockers: ["Environment access pending"],
      plans: ["Set up CI/CD", "Begin sprint 1"],
      author: { name: "Alex Johnson", email: "alex@example.com" },
      team: "Platform",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      aiSummary: "",
    },
    {
      id: uid(),
      title: "Week 2 Progress - Data Pipeline",
      weekOf: "2025-01-13",
      accomplishments: ["Implemented ingestion job", "Wrote unit tests"],
      blockers: [],
      plans: ["Add monitoring", "Document runbooks"],
      author: { name: "Taylor Smith", email: "taylor@example.com" },
      team: "Data",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      aiSummary: "",
    },
  ];
  return base;
}

// PUBLIC_INTERFACE
export function ReportsProvider({ children }) {
  /**
   * Provides in-memory CRUD with optional localStorage persistence.
   * TODO: Replace with Supabase DB and Functions for AI summaries later.
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize from localStorage or seed demo
  useEffect(() => {
    const persisted = localStorage.getItem("mock_reports");
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        dispatch({ type: "INIT", payload: parsed });
        return;
      } catch {
        // ignore parse errors
      }
    }
    dispatch({ type: "INIT", payload: seedData() });
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (state.persist) {
      localStorage.setItem("mock_reports", JSON.stringify(state.reports));
    }
  }, [state.reports, state.persist]);

  const api = useMemo(
    () => ({
      reports: state.reports,
      persist: state.persist,
      // PUBLIC_INTERFACE
      setPersistence: (enabled) => dispatch({ type: "TOGGLE_PERSIST", payload: enabled }),
      // PUBLIC_INTERFACE
      createReport: (data) => {
        const newReport = {
          id: uid(),
          createdAt: nowISO(),
          updatedAt: nowISO(),
          aiSummary: "",
          ...data,
        };
        dispatch({ type: "CREATE", payload: newReport });
        return newReport;
      },
      // PUBLIC_INTERFACE
      updateReport: (id, updates) => {
        dispatch({ type: "UPDATE", payload: { id, ...updates } });
      },
      // PUBLIC_INTERFACE
      deleteReport: (id) => {
        dispatch({ type: "DELETE", payload: id });
      },
      // PUBLIC_INTERFACE
      getReport: (id) => state.reports.find((r) => r.id === id),
      // PUBLIC_INTERFACE
      generateMockSummary: (id) => {
        // Simple fabricated summary based on content
        const r = state.reports.find((x) => x.id === id);
        if (!r) return "";
        const acc = r.accomplishments?.length || 0;
        const bl = r.blockers?.length || 0;
        const pl = r.plans?.length || 0;
        const msg = `AI Summary (mock): Strong progress with ${acc} accomplishment(s); ${bl} blocker(s) noted; ${pl} plan item(s) set for next week. Focus remains on ${r.title}.`;
        dispatch({ type: "UPDATE", payload: { id, aiSummary: msg } });
        return msg;
      },
    }),
    [state.reports, state.persist]
  );

  return <ReportsContext.Provider value={api}>{children}</ReportsContext.Provider>;
}

export default ReportsContext;
