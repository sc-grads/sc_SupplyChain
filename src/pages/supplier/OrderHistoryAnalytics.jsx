import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useAnalytics } from "../../context/AnalyticsContext";

const OrderHistoryAnalytics = () => {
  const { supplierAnalytics, loading, error, fetchAnalytics } = useAnalytics();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [retailerFilter, setRetailerFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const orders = supplierAnalytics?.deliveredOrders || [];

  // Get unique retailers for filter
  const uniqueRetailers = Array.from(
    new Set(orders.map((o) => o.retailer)),
  ).sort();

  // Get unique months for filter
  const uniqueMonths = Array.from(
    new Set(
      orders.map((o) => {
        const d = new Date(o.placedAt);
        return d.toLocaleString("default", { month: "long", year: "numeric" });
      }),
    ),
  );

  // Filtering Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.retailer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRetailer =
      retailerFilter === "All" || o.retailer === retailerFilter;

    let matchesDate = true;
    if (dateFilter !== "All") {
      const orderMonth = new Date(o.placedAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      matchesDate = orderMonth === dateFilter;
    }

    return matchesSearch && matchesRetailer && matchesDate;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Export to CSV Logic
  const handleExportCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) return;

    // CSV Headers
    const headers = [
      "Order ID",
      "Date",
      "Retailer",
      "Value",
      "Lead Time",
      "Rating (Stars)",
    ];

    // Format rows
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.date,
      order.retailer,
      // Remove currency symbol and whitespace for better spreadsheet compatibility if needed,
      // but keeping it simple as a string for now as requested.
      order.value,
      order.leadTime,
      order.stars,
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `Supplier_Order_History_${date}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !supplierAnalytics) {
    return (
      <Layout>
        <div className="max-w-[1240px] mx-auto pb-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Order History Report
          </h2>
          <p className="text-gray-500">Loading history data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1240px] mx-auto pb-12">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight leading-none">
              Order History Report
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Detailed view of all past orders and fulfillment performance
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="h-11 px-6 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-105 transition-all shadow-sm flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV Report
          </button>
        </div>

        {/* Search & Filters Bar */}
        {/* Search & Filters Bar */}
        <div className="bg-white dark:bg-gray-900 p-6 mb-8 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-end gap-6">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
              Search Documentation
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search by Order ID or Retailer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-6">
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
                Retailer Entity
              </label>
              <div className="relative">
                <select
                  value={retailerFilter}
                  onChange={(e) => {
                    setRetailerFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-4 pr-10 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-semibold uppercase tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <option value="All">All Retailers</option>
                  {uniqueRetailers.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
                Reporting Period
              </label>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-4 pr-10 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-semibold uppercase tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <option value="All">All History</option>
                  {uniqueMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Order List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
              Delivered Orders Documentation
            </h3>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-widest border border-primary/20">
              {filteredOrders.length} Records Found
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order Reference
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Completion Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Retailer Entity
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Total Revenue
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center">
                    Turnaround
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0"
                    >
                      <td className="px-6 py-5 font-black text-sm text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {order.retailer}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-primary">
                          {order.value}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          {order.leadTime}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-xl">
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
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No delivered orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Showing{" "}
              <span className="text-gray-900 dark:text-white">
                {filteredOrders.length > 0 ? startIndex + 1 : 0}-
                {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 dark:text-white">
                {filteredOrders.length}
              </span>{" "}
              Records
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistoryAnalytics;
