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
      className={`bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border ${borderColor} ${shadowColor ? `shadow-lg ${shadowColor}` : "shadow-sm"} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className={`${iconColor} material-symbols-outlined text-3xl`}>
          {icon}
        </span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${trendBg} ${trendColor}`}
        >
          {trendLabel}
        </span>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {title}
        </p>
        <p className="text-3xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
};

export default BentoCard;
