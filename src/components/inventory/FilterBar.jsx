import React from "react";

const FilterBar = ({ activeFilter, onFilterChange, counts }) => {
  const chips = [
    {
      label: "All SKUs",
      id: "All",
      count: counts?.All || 0,
      color: "bg-primary",
    },
    {
      label: "Low Stock",
      id: "Low Stock",
      count: counts?.Low || 0,
      color: "bg-amber-100",
      textColor: "text-amber-700",
    },
    {
      label: "Out of Stock",
      id: "Out of Stock",
      count: counts?.OOS || 0,
      color: "bg-red-100",
      textColor: "text-red-700",
    },
    {
      label: "At Risk",
      id: "At Risk",
      count: counts?.AtRisk || 0,
      color: "bg-primary/10",
      textColor: "text-primary",
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip) => (
        <div
          key={chip.id}
          onClick={() => onFilterChange(chip.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${
            activeFilter === chip.id
              ? "bg-primary text-white shadow-md scale-105"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
          }`}
        >
          {chip.label}{" "}
          <span
            className={`px-1.5 rounded text-[10px] ${
              activeFilter === chip.id
                ? "bg-white/20"
                : chip.color || "bg-gray-200"
            } ${chip.textColor || ""}`}
          >
            {chip.count.toLocaleString()}
          </span>
        </div>
      ))}
      <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer opacity-50">
        <span className="material-symbols-outlined text-sm">filter_list</span>
        More Filters
      </div>
    </div>
  );
};

export default FilterBar;
