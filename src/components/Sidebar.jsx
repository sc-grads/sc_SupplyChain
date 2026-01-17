import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>EasyStock</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link
          to="/active-orders"
          className={`nav-item ${isActive("/active-orders") ? "active" : ""}`}
        >
          <span className="nav-icon">📦</span>
          Active Orders
        </Link>
        <Link
          to="/history"
          className={`nav-item ${isActive("/history") ? "active" : ""}`}
        >
          <span className="nav-icon">🕒</span>
          History
        </Link>
        <Link
          to="/settings"
          className={`nav-item ${isActive("/settings") ? "active" : ""}`}
        >
          <span className="nav-icon">⚙️</span>
          Settings
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Supplier</span>
          </div>
        </div>
        <Link to="/" className="logout-btn">
          Log out
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
