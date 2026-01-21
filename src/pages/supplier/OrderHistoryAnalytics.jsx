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
          <h2 className="text-3xl font-extrabold tracking-tight">
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
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#121615] dark:text-white">
              Order History Report
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Detailed view of all past orders and fulfillment performance
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white dark:bg-gray-900 p-4 mb-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary dark:text-gray-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Filter Retailer:
              </span>
              <div className="relative">
                <select
                  value={retailerFilter}
                  onChange={(e) => {
                    setRetailerFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary appearance-none dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <option value="All">All Retailers</option>
                  {uniqueRetailers.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Date:
              </span>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary appearance-none dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <option value="All">All Time</option>
                  {uniqueMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Order List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="text-lg font-bold text-[#121615] dark:text-white">
              Delivered Orders History
            </h3>
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest">
              {filteredOrders.length} Total Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Retailer
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Lead Time
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-[#121615] dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#121615] dark:text-white">
                        {order.retailer}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-primary">
                        {order.value}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                        {order.leadTime}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors">
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
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No delivered orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <p className="text-xs font-bold text-gray-400 tracking-wide">
              Showing {filteredOrders.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">
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
