import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useAnalytics } from "../../context/AnalyticsContext";

const SmallBusinessPerformance = () => {
  const { analyticsData, loading, error } = useAnalytics();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getHeatColor = (val) => {
    if (val === 10) return "bg-primary/10";
    if (val <= 30) return "bg-risk-amber/30";
    if (val <= 50) return "bg-risk-amber/50";
    if (val <= 70) return "bg-risk-amber/70";
    return "bg-risk-amber";
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-[#6a8179]">Loading analytics data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-red-500">Error loading analytics: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Empty state
  if (!analyticsData) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-[#6a8179]">No analytics data available yet.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    totalSpendFormatted,
    mostStableSupplier,
    stockoutsAvoided,
    supplierPerformance,
    disruptionHeatmap,
    deliveredOrders,
    trends,
  } = analyticsData;

  // Pagination logic
  const totalPages = Math.ceil((deliveredOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = deliveredOrders?.slice(startIndex, endIndex) || [];

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-[#6a8179]">
              Monitoring resilience and vendor efficiency metrics for Q4 2023.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                payments
              </span>
              {trends.spendTrend && (
                <span className="text-[#07882e] text-xs font-bold bg-[#07882e]/10 px-2 py-1 rounded">
                  {trends.spendTrend}
                </span>
              )}
            </div>
            <p className="text-[#6a8179] text-sm font-medium">Total Spend</p>
            <p className="text-2xl font-bold mt-1 truncate">
              {totalSpendFormatted}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                star_half
              </span>
            </div>
            <p className="text-[#6a8179] text-sm font-medium">
              Most Stable Supplier
            </p>
            <p className="text-2xl font-bold mt-1 truncate">
              {mostStableSupplier.name}
            </p>
          </div>

          <div className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-risk-amber bg-primary/10 p-2 rounded-lg">
                security
              </span>
              <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">
                Resilient
              </span>
            </div>
            <p className="text-[#6a8179] text-sm font-medium">
              Stockouts Avoided
            </p>
            <p className="text-2xl font-bold mt-1 truncate">
              {stockoutsAvoided} Events
            </p>
          </div>
        </div>

        {/* Charts Section - Two Separate Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Supplier Spending Graph */}
          <div className="bg-white dark:bg-[#1e2227] p-8 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-2">Supplier Spending</h3>
              <p className="text-sm text-[#6a8179]">
                Total spend per supplier (ZAR)
              </p>
            </div>

            {/* Spending Bar Chart */}
            <div className="relative pt-6">
              {supplierPerformance && supplierPerformance.length > 0 ? (
                <>
                  {/* Chart Area */}
                  <div className="flex items-end justify-around gap-4 h-80 border-b-2 border-l-2 border-[#dde3e1] dark:border-gray-700 ml-12 pl-6">
                    {supplierPerformance.map((s, i) => {
                      // Calculate height relative to the maximum spend in the dataset
                      const maxSpendPercentage = Math.max(
                        ...supplierPerformance.map((sp) => sp.spend),
                      );
                      const relativeHeight =
                        (s.spend / maxSpendPercentage) * 100;

                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 group flex-1 relative"
                        >
                          {/* Value Label Above Bar */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-primary whitespace-nowrap">
                            {s.spendVal}
                          </div>

                          {/* Spend Bar */}
                          <div className="relative flex flex-col items-center justify-end h-full w-full">
                            <div
                              className="w-full max-w-[60px] bg-primary rounded-t relative transition-all duration-300 group-hover:brightness-110 shadow-md"
                              style={{
                                height: `${Math.max(relativeHeight, 1)}%`,
                              }}
                            ></div>
                          </div>

                          {/* Supplier Name Below X-axis */}
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-[#6a8179] text-center leading-tight w-24 group-hover:text-[#121615] dark:group-hover:text-white transition-colors">
                            {s.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Y-axis labels - Currency */}
                  <div className="absolute left-0 top-6 h-80 flex flex-col justify-between text-xs text-[#6a8179] font-medium w-10 text-right">
                    {supplierPerformance.length > 0 &&
                      (() => {
                        const maxSpend = Math.max(
                          ...supplierPerformance.map((s) => s.spend),
                        );
                        const maxSpendSupplier = supplierPerformance.find(
                          (s) => s.spend === maxSpend,
                        );
                        const maxValue =
                          parseFloat(
                            maxSpendSupplier?.spendVal.replace(/[^0-9.]/g, ""),
                          ) || 100;
                        const unit = maxSpendSupplier?.spendVal.includes("k")
                          ? "k"
                          : "";

                        return (
                          <>
                            <span className="transform -translate-y-1/2">
                              R{maxValue}
                              {unit}
                            </span>
                            <span className="transform -translate-y-1/2">
                              R{(maxValue * 0.75).toFixed(0)}
                              {unit}
                            </span>
                            <span className="transform -translate-y-1/2">
                              R{(maxValue * 0.5).toFixed(0)}
                              {unit}
                            </span>
                            <span className="transform -translate-y-1/2">
                              R{(maxValue * 0.25).toFixed(0)}
                              {unit}
                            </span>
                            <span className="transform translate-y-1/2">
                              R0
                            </span>
                          </>
                        );
                      })()}
                  </div>
                </>
              ) : (
                <div className="w-full h-80 flex items-center justify-center text-[#6a8179]">
                  No spending data available
                </div>
              )}
            </div>
          </div>

          {/* Supplier Reliability Score Graph */}
          <div className="bg-white dark:bg-[#1e2227] p-8 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-2">
                Supplier Reliability Score
              </h3>
              <p className="text-sm text-[#6a8179]">
                Average rating per supplier (1-5 scale)
              </p>
            </div>

            {/* Reliability Score Bar Chart */}
            <div className="relative pt-6">
              {supplierPerformance && supplierPerformance.length > 0 ? (
                <>
                  {/* Chart Area */}
                  <div className="flex items-end justify-around gap-4 h-80 border-b-2 border-l-2 border-[#dde3e1] dark:border-gray-700 ml-12 pl-6">
                    {supplierPerformance.map((s, i) => {
                      const scorePercentage =
                        (parseFloat(s.scoreVal) / 5) * 100;

                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 group flex-1 relative"
                        >
                          {/* Score Label Above Bar */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-risk-amber whitespace-nowrap">
                            {s.scoreVal}
                          </div>

                          {/* Score Bar */}
                          <div className="relative flex flex-col items-center justify-end h-full w-full">
                            <div
                              className="w-full max-w-[60px] bg-risk-amber rounded-t relative transition-all duration-300 group-hover:brightness-110 shadow-md"
                              style={{
                                height: `${Math.max(scorePercentage, 5)}%`,
                                minHeight: "50px",
                              }}
                            ></div>
                          </div>

                          {/* Supplier Name Below X-axis */}
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-[#6a8179] text-center leading-tight w-24 group-hover:text-[#121615] dark:group-hover:text-white transition-colors">
                            {s.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Y-axis labels - Rating Scale */}
                  <div className="absolute left-0 top-6 h-80 flex flex-col justify-between text-xs text-[#6a8179] font-medium w-10 text-right">
                    <span className="transform -translate-y-1/2">5.0</span>
                    <span className="transform -translate-y-1/2">3.75</span>
                    <span className="transform -translate-y-1/2">2.5</span>
                    <span className="transform -translate-y-1/2">1.25</span>
                    <span className="transform translate-y-1/2">0.0</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-80 flex items-center justify-center text-[#6a8179]">
                  No reliability data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#1e2227] rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dde3e1] dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">Delivered Orders History</h3>
            <button className="p-2 hover:bg-background-light dark:hover:bg-white/5 rounded-lg text-[#6a8179]">
              <span className="material-symbols-outlined text-xl">
                filter_list
              </span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Delivery Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Total Value
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Reliability
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-right text-[#6a8179]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e1] dark:divide-gray-800">
                {currentOrders && currentOrders.length > 0 ? (
                  currentOrders.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-background-light/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-bold">{row.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {row.supplier}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6a8179] font-medium">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {row.value}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5 text-risk-amber">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`material-symbols-outlined text-lg ${s <= row.stars ? "fill-1" : ""}`}
                              style={{
                                fontVariationSettings: `'FILL' ${s <= row.stars ? 1 : 0}`,
                              }}
                            >
                              {s === Math.ceil(row.stars) && row.stars % 1 !== 0
                                ? "star_half"
                                : "star"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#6a8179] hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">
                            more_horiz
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-[#6a8179]"
                    >
                      No delivered orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#dde3e1] dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#6a8179]">
            <span>
              Showing {startIndex + 1}-
              {Math.min(endIndex, deliveredOrders?.length || 0)} of{" "}
              {deliveredOrders?.length || 0} orders
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#dde3e1] dark:border-gray-800 rounded hover:bg-background-light dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-[#dde3e1] dark:border-gray-800 rounded hover:bg-background-light dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmallBusinessPerformance;
