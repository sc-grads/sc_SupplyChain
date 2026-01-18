import React from "react";

const getStatusStyles = (status, type = "default") => {
  const styles = {
    // Inventory Status
    Available: "bg-status-green text-white border-status-green",
    "Low Stock": "bg-status-amber text-white border-status-amber",
    "Out of Stock": "bg-status-red text-white border-status-red",

    // Order Status
    New: "bg-new-blue/10 text-new-blue border-new-blue/20",
    Pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",

    // General Tags
    "DRY GOODS":
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    CONDIMENTS: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    ADDITIVES: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    SEASONING: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",

    // Fallback
    default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return styles[status] || styles["default"];
};

const StatusBadge = ({ status, className = "", children }) => {
  const baseStyles = "px-2 py-0.5 rounded text-[11px] font-bold border";
  const statusStyles = getStatusStyles(status);

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
