import React from "react";
import StatusBadge from "../common/StatusBadge";

const InventoryTableRow = ({ item }) => {
  // Map backend data to frontend variables
  const name = item.sku?.name || "Unknown Product";
  const skuCode = item.sku?.code || "N/A";
  const category = item.sku?.description || "General";
  const currentStock = item.quantity || 0;
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

  // Map derived status to frontend display strings and colors
  const statusLabels = {
    AVAILABLE: "Available",
    LOW: "Low Stock",
    UNAVAILABLE: "Out of Stock",
  };

  // Progress bar color derivation
  let progressColor = "bg-primary";
  if (derivedStatus === "LOW") progressColor = "bg-status-amber";
  if (derivedStatus === "UNAVAILABLE") progressColor = "bg-status-red";

  // Gradient derivation based on status
  const gradients = {
    AVAILABLE: "from-blue-100 dark:from-blue-900 to-blue-200 dark:to-blue-800",
    LOW: "from-amber-100 dark:from-amber-900 to-amber-200 dark:to-amber-800",
    UNAVAILABLE: "from-red-100 dark:from-red-900 to-red-200 dark:to-red-800",
  };
  const bgGradient = `bg-gradient-to-br ${gradients[derivedStatus] || gradients.AVAILABLE}`;

  // Mock Price Generation (consistent by SKU)
  const getMockPrice = (sku) => {
    let hash = 0;
    for (let i = 0; i < sku.length; i++) {
      hash = sku.charCodeAt(i) + ((hash << 5) - hash);
    }
    const price = (Math.abs(hash) % 500) + 50; // Price between 50 and 550
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const price = getMockPrice(skuCode);

  return (
    <tr
      className={`hover:bg-primary/5 transition-colors group ${derivedStatus === "UNAVAILABLE" ? "bg-red-50/20 dark:bg-red-950/5" : ""}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden ${derivedStatus === "UNAVAILABLE" ? "grayscale" : ""}`}
          >
            <div className={`w-full h-full ${bgGradient}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                {name}
              </p>
            </div>
            <p className="text-[11px] font-mono text-gray-400 mt-0.5">
              SKU: {skuCode}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={category.toLowerCase()}>{category}</StatusBadge>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {price}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between">
            <span
              className={`text-sm font-black ${currentStock === 0 ? "text-red-600" : ""}`}
            >
              {currentStock}{" "}
              <span className="text-gray-400 font-normal">/ {maxStock}</span>
            </span>
          </div>
          <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="w-fit">
          {derivedStatus === "AVAILABLE" && (
            <div
              style={{ backgroundColor: "rgb(51 153 119)" }}
              className="px-2 py-1 text-white rounded-[8px] text-[10px] font-black tracking-wider uppercase shadow-sm"
            >
              Available
            </div>
          )}
          {derivedStatus === "LOW" && (
            <div
              style={{ backgroundColor: "#ECBD6C" }}
              className="px-2 py-1 text-black rounded-[8px] text-[10px] font-black tracking-wider uppercase shadow-sm"
            >
              Low Stock
            </div>
          )}
          {derivedStatus === "UNAVAILABLE" && (
            <div
              style={{ backgroundColor: "rgb(185 28 28)" }}
              className="px-2 py-1 text-white rounded-[8px] text-[10px] font-black tracking-wider uppercase shadow-sm"
            >
              OOS
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          disabled
          className="opacity-40 cursor-not-allowed inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 transition-all"
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
        </button>
      </td>
    </tr>
  );
};

export default InventoryTableRow;
