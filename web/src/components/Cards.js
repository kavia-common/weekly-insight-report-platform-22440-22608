import React from "react";

/**
 * Simple card container
 */
export function Card({ title, subtitle, children, footer }) {
  return (
    <div className="card">
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

/**
 * KPI numeric card
 */
export function Kpi({ label, value, trend }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {trend && <div className={`kpi-trend ${trend > 0 ? "up" : trend < 0 ? "down" : ""}`}>
        {trend > 0 ? "▲" : trend < 0 ? "▼" : "•"} {Math.abs(trend)}%
      </div>}
    </div>
  );
}
