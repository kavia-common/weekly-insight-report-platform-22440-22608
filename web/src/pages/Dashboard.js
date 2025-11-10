import React, { useMemo } from "react";
import Layout from "../components/Layout/Layout";
import { useReports } from "../context/ReportsContext";
import { Card, Kpi } from "../components/Cards";
import { BarChart, LineSpark } from "../components/Charts";

/**
 * PUBLIC_INTERFACE
 * Dashboard presents mock analytics and quick insights.
 */
export default function Dashboard() {
  const { reports } = useReports();

  const stats = useMemo(() => {
    const thisMonth = reports.filter((r) => {
      const d = new Date(r.weekOf);
      const n = new Date();
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }).length;

    const avgAcc = Math.round(
      reports.reduce((s, r) => s + (r.accomplishments?.length || 0), 0) / Math.max(reports.length, 1)
    );

    const blockers = reports.reduce((s, r) => s + (r.blockers?.length || 0), 0);

    return { thisMonth, avgAcc, blockers };
  }, [reports]);

  const barData = useMemo(() => {
    // group by team pseudo
    const teams = {};
    reports.forEach((r) => {
      const t = r.team || "General";
      teams[t] = (teams[t] || 0) + (r.accomplishments?.length || 0);
    });
    return Object.keys(teams).map((t) => ({ label: t, value: teams[t] }));
  }, [reports]);

  return (
    <Layout>
      <div className="grid grid-3">
        <Card title="Reports this month" subtitle="Submitted in current month">
          <Kpi label="Total" value={stats.thisMonth} trend={stats.thisMonth > 2 ? 8 : -3} />
        </Card>
        <Card title="Avg accomplishments" subtitle="Per report">
          <Kpi label="Average" value={stats.avgAcc} trend={stats.avgAcc >= 3 ? 5 : -4} />
        </Card>
        <Card title="Blockers observed" subtitle="Across all reports">
          <Kpi label="Count" value={stats.blockers} trend={stats.blockers > 0 ? -6 : 0} />
        </Card>
      </div>

      <div className="grid grid-2">
        <Card title="Accomplishments by team">
          <BarChart data={barData} />
        </Card>
        <Card title="Submission trend">
          <LineSpark points={[3, 4, 2, 5, 6, 5, 7, 8, 5, 6, 7]} />
        </Card>
      </div>
    </Layout>
  );
}
