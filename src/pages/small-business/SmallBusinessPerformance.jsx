import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useAnalytics } from "../../context/AnalyticsContext";

const SmallBusinessPerformance = () => {
  const { analyticsData, loading, error } = useAnalytics();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
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

  const { deliveredOrders } = analyticsData;

  // Filtering logic
  const filteredOrders = (deliveredOrders || []).filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      supplierFilter === "All" || order.supplier === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  // Get unique suppliers for filter dropdown
  const uniqueSuppliers = Array.from(
    new Set(deliveredOrders?.map((o) => o.supplier) || []),
  );

  // Pagination logic
  const totalPages = Math.ceil((filteredOrders.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleExportCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      alert("No data available to export.");
      return;
    }

    // CSV Headers
    const headers = [
      "Order ID",
      "Supplier",
      "Delivery Date",
      "Total Value",
      "Reliability (Stars)",
    ];

    // Format rows
    const rows = filteredOrders.map((order) => [
      `"${order.id}"`,
      `"${order.supplier}"`,
      `"${order.date}"`,
      `"${order.value.replace("R", "ZAR ")}"`, // Formatting for Excel compatibility
      `"${order.stars}"`,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Supply_Chain_Performance_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-[#6a8179] mt-1">
              Monitoring resilience and vendor efficiency metrics for Q4 2023.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined text-base font-bold">
              download
            </span>
            Export Report
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-[#1e2227] p-5 rounded-2xl border border-[#dde3e1] dark:border-gray-800 shadow-sm mb-8 flex flex-wrap gap-6 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6a8179] text-xl">
              search
            </span>
            <input
              className="w-full h-11 pl-12 pr-4 bg-[#f8faf9] dark:bg-white/5 border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl text-sm transition-all"
              placeholder="Search by Order ID or Supplier..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#6a8179] uppercase tracking-widest whitespace-nowrap">
              Filter Supplier:
            </span>
            <select
              className="h-11 px-4 bg-[#f8faf9] dark:bg-white/5 border-none rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer min-w-[180px]"
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Suppliers</option>
              {uniqueSuppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#1e2227] rounded-2xl border border-[#dde3e1] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dde3e1] dark:border-gray-800 flex items-center justify-between bg-[#fcfdfd] dark:bg-white/[0.02]">
            <h3 className="font-bold text-lg">Delivered Orders History</h3>
            <div className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
              {filteredOrders.length} Total Records
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8faf9] dark:bg-white/5 border-b border-[#dde3e1] dark:border-gray-800">
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-[#6a8179]">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-[#6a8179]">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-[#6a8179]">
                    Delivery Date
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-[#6a8179]">
                    Total Value
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.1em] text-[#6a8179]">
                    Reliability
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-right text-[#6a8179] uppercase tracking-[0.1em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e1] dark:divide-gray-800">
                {currentOrders && currentOrders.length > 0 ? (
                  currentOrders.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#f8faf9]/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-bold">{row.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200">
                        {row.supplier}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6a8179] font-medium">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-primary">
                        {row.value}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5 text-risk-amber">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`material-symbols-outlined text-lg ${s <= row.stars ? "fill-1" : "opacity-30"}`}
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
                        <button className="text-[#6a8179] hover:text-primary p-2 hover:bg-primary/5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
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
                      className="px-6 py-12 text-center text-[#6a8179] font-medium italic"
                    >
                      No matching records found for "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t border-[#dde3e1] dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#6a8179] bg-[#fcfdfd] dark:bg-white/[0.02]">
            <span>
              Showing {filteredOrders.length > 0 ? startIndex + 1 : 0}-
              {Math.min(endIndex, filteredOrders.length)} of{" "}
              {filteredOrders.length} records
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#dde3e1] dark:border-gray-800 rounded-xl hover:bg-[#f8faf9] dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border border-[#dde3e1] dark:border-gray-800 rounded-xl hover:bg-[#f8faf9] dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
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
