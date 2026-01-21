import React from "react";

const BentoCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  trendColor = "text-new-blue", // e.g. "text-new-blue", "text-primary", "text-risk-amber"
  trendBg = "bg-new-blue/10", // e.g. "bg-new-blue/10"
  iconColor = "text-new-blue",
  borderColor = "border-new-blue/30",
  shadowColor = "", // e.g. "shadow-risk-amber/5"
  onClick,
}) => {
  return (
    <div
      className={`bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className={`${iconColor} material-symbols-outlined text-3xl`}>
          {icon}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${trendBg} ${trendColor}`}
        >
          {trendLabel}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold tracking-tight leading-none text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default BentoCard;
