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
    <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onFilterChange(chip.id)}
          className={`flex items-center gap-4 px-5 h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
            activeFilter === chip.id
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {chip.label}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] items-center justify-center flex min-w-[24px] ${
              activeFilter === chip.id
                ? "bg-white/20 text-white"
                : "bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700"
            }`}
          >
            {chip.count.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
