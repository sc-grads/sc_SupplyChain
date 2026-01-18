import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isSmallBusiness = user?.role === "VENDOR";

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
          <div className="avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">
              {isSmallBusiness ? "Small Business Account" : "Supplier Account"}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="logout-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
