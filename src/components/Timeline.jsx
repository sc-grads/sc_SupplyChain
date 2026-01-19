import React from "react";

const Timeline = ({ status, timestamps }) => {
  // status: "PLACED" | "OUT_FOR_DELIVERY" | "DELIVERED"
  // timestamps: { placedAt, outForDeliveryAt, deliveredAt }

  const steps = [
    {
      id: "PLACED",
      label: "Order Placed",
      timestamp: timestamps?.placedAt,
    },
    {
      id: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      timestamp: timestamps?.outForDeliveryAt,
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      timestamp: timestamps?.deliveredAt,
    },
  ];

  const getStepState = (stepId) => {
    if (status === "DELIVERED") return "completed";

    if (status === "OUT_FOR_DELIVERY") {
      if (stepId === "PLACED") return "completed";
      if (stepId === "OUT_FOR_DELIVERY") return "completed";
      return "pending";
    }

    // Default: PLACED
    if (stepId === "PLACED") return "completed";
    return "pending";
  };

  const Step = ({ step, state, isLast }) => {
    const isCompleted = state === "completed";
    const isActive = state === "active";
    const isPending = state === "pending";

    return (
      <div className="relative flex gap-4 pb-8 last:pb-0">
        {!isLast && (
          <div
            className={`absolute top-8 left-[11px] w-0.5 h-[calc(100%-8px)] -z-10
            ${isCompleted ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
          />
        )}

        <div
          className={`
          relative flex items-center justify-center w-6 h-6 rounded-full border-[3px] 
          ${isCompleted ? "bg-primary border-primary text-white" : ""}
          ${isActive ? "bg-primary border-primary/30" : ""}
          ${isPending ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600" : ""}
        `}
        >
          {isCompleted && (
            <span className="material-symbols-outlined text-[14px] font-bold">
              check
            </span>
          )}
          {isActive && (
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex-1 -mt-1">
          <p
            className={`text-sm font-bold ${isPending ? "text-gray-400" : "text-[#121714] dark:text-white"}`}
          >
            {step.label}
          </p>
          {step.timestamp && (isCompleted || isActive) && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {new Date(step.timestamp).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
              {" · "}
              {new Date(step.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-2 pl-2">
      {steps.map((step, index) => (
        <Step
          key={step.id}
          step={step}
          state={getStepState(step.id)}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export default Timeline;
