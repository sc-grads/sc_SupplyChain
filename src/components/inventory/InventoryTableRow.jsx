import React from "react";
import StatusBadge from "../common/StatusBadge";

const InventoryTableRow = ({ item, onEdit }) => {
  // Map backend data to frontend variables
  const name = item.sku?.name || "Unknown Product";
  const skuCode = item.sku?.code || "N/A";
  const category = item.sku?.description || "General";
  const currentStock = item.quantity || 0;
  const price = item.price
    ? `R ${parseFloat(item.price).toFixed(2)}`
    : "R 0.00";
  const maxStock = 1000; // Default for prototype visualization
  // Percentage calculation
  const percentage = Math.min(Math.round((currentStock / maxStock) * 100), 100);

  // Automated Status Derivation
  let derivedStatus = "AVAILABLE";
  if (percentage === 0) {
    derivedStatus = "UNAVAILABLE";
  } else if (percentage <= 30) {
    derivedStatus = "LOW";
  }

  // Progress bar color derivation
  let progressColor = "bg-primary";
  if (derivedStatus === "LOW") progressColor = "bg-risk-amber";
  if (derivedStatus === "UNAVAILABLE") progressColor = "bg-red-500";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border-b border-gray-100 dark:border-gray-800 last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div
            className={`h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 ${derivedStatus === "UNAVAILABLE" ? "grayscale opacity-50" : ""}`}
          >
            <span className="material-symbols-outlined text-gray-400">
              inventory_2
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {name}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              SKU: {skuCode}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <StatusBadge status={category.toLowerCase()}>{category}</StatusBadge>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
          {price}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2 items-center">
          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-widest ${currentStock === 0 ? "text-red-500" : "text-gray-400"}`}
          >
            {currentStock} / {maxStock} Units
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <StatusBadge status={derivedStatus} />
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEdit(item)}
          className="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary hover:bg-primary/10 transition-all font-semibold text-[10px] uppercase tracking-widest gap-2"
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
          Manage
        </button>
      </td>
    </tr>
  );
};

export default InventoryTableRow;
