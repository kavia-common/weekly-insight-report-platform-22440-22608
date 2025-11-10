import React from "react";

/**
 * Mock charts using simple bars and lines with CSS.
 * No external chart library or network calls.
 */
export function BarChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div key={d.label} className="bar-wrap" title={`${d.label}: ${d.value}`}>
          <div
            className="bar"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export function LineSpark({ points = [] }) {
  const max = Math.max(1, ...points);
  return (
    <div className="spark">
      {points.map((v, i) => {
        const pct = (v / max) * 100;
        return <div key={i} className="spark-dot" style={{ height: `${pct}%` }} />;
      })}
    </div>
  );
}
