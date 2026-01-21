import React from "react";

const getStatusStyles = (status) => {
  const styles = {
    // Inventory Status (Standardized Colors)
    Available: "bg-primary/10 text-primary border-primary/20",
    "Low Stock": "bg-risk-amber/10 text-risk-amber border-risk-amber/20",
    "Out of Stock": "bg-red-50 text-red-600 border-red-100",
    AVAILABLE: "bg-primary/10 text-primary border-primary/20",
    LOW: "bg-risk-amber/10 text-risk-amber border-risk-amber/20",
    UNAVAILABLE: "bg-red-50 text-red-600 border-red-100",

    // Order Status
    New: "bg-primary/10 text-primary border-primary/20",
    Pending: "bg-risk-amber/10 text-risk-amber border-risk-amber/20",
    DELIVERED: "bg-success/10 text-success border-success/20",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",

    // General Tags (SaaS Neutral)
    default:
      "bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  };

  const key = status?.toString().toUpperCase().replace(/ /g, "_") || "DEFAULT";
  const normalizedKey =
    Object.keys(styles).find((k) => k.toUpperCase() === key) || "default";

  return styles[normalizedKey] || styles["default"];
};

const StatusBadge = ({ status, className = "", children }) => {
  const baseStyles =
    "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border transition-all";
  const statusStyles = getStatusStyles(status);

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
