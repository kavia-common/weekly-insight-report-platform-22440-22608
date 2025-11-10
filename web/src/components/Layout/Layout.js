import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * App shell layout with left sidebar + top header.
 */
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
