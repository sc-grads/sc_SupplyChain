import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useInventory } from "../../context/InventoryContext";

const SmallBusinessInventory = () => {
  const { inventory, fetchInventory, loading } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'low', 'out'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Categories derivation
  const categories = [
    "All",
    ...new Set(inventory.map((item) => item.category)),
  ].filter(Boolean);

  // Filtering Logic
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    let matchesTab = true;
    if (activeTab === "low")
      matchesTab =
        item.currentStock > 0 && item.currentStock <= item.reorderLevel;
    if (activeTab === "out") matchesTab = item.currentStock === 0;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const lowStockCount = inventory.filter(
    (item) => item.currentStock > 0 && item.currentStock <= item.reorderLevel,
  ).length;
  const outOfStockCount = inventory.filter(
    (item) => item.currentStock === 0,
  ).length;

  const getStockColor = (current, reorder) => {
    if (current === 0) return "bg-status-red";
    if (current <= reorder) return "bg-status-amber";
    return "bg-status-green";
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Page Heading & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
              My Inventory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Track your store inventory and reorder supplies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#111418] dark:text-white hover:bg-gray-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sm">
                cloud_download
              </span>
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 h-10 bg-primary text-white rounded-lg text-sm font-bold hover:brightness-105 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Item
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search products..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${activeTab === "all" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
          >
            All Items{" "}
            <span
              className={`px-1.5 rounded text-[10px] ${activeTab === "all" ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              {inventory.length}
            </span>
          </div>
          <div
            onClick={() => setActiveTab("low")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${activeTab === "low" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
          >
            Low Stock{" "}
            <span
              className={`px-1.5 rounded text-[10px] ${activeTab === "low" ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"}`}
            >
              {lowStockCount}
            </span>
          </div>
          <div
            onClick={() => setActiveTab("out")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${activeTab === "out" ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
          >
            Out of Stock{" "}
            <span
              className={`px-1.5 rounded text-[10px] ${activeTab === "out" ? "bg-white/20" : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"}`}
            >
              {outOfStockCount}
            </span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Reorder Level
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Last Ordered
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-primary/5 transition-colors group ${item.currentStock === 0 ? "bg-red-50/20 dark:bg-red-950/5" : item.currentStock <= item.reorderLevel ? "bg-amber-50/20 dark:bg-amber-950/5" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden ${item.currentStock === 0 ? "grayscale" : item.currentStock <= item.reorderLevel ? "border-2 border-amber-400/40" : ""}`}
                        >
                          <div
                            className={`w-full h-full bg-gradient-to-br ${item.currentStock === 0 ? "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800" : item.currentStock <= item.reorderLevel ? "from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800" : "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"}`}
                          ></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                              {item.name}
                            </p>
                            {item.currentStock <= item.reorderLevel && (
                              <span
                                className={`size-2 rounded-full ${item.currentStock === 0 ? "bg-red-500" : "bg-amber-500 animate-pulse"}`}
                              ></span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                        {item.category || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-end justify-between">
                          <span
                            className={`text-sm font-black ${item.currentStock === 0 ? "text-red-600" : item.currentStock <= item.reorderLevel ? "text-amber-600" : ""}`}
                          >
                            {item.currentStock}{" "}
                            <span className="text-gray-400 font-normal">
                              {item.unit || "units"}
                            </span>
                          </span>
                        </div>
                        <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStockColor(item.currentStock, item.reorderLevel)}`}
                            style={{
                              width: `${Math.min((item.currentStock / (item.reorderLevel * 2)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-500">
                        {item.reorderLevel} {item.unit || "units"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {item.lastOrdered || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          className={`inline-flex items-center justify-center px-3 h-8 rounded text-white text-xs font-bold hover:brightness-105 transition-all ${item.currentStock === 0 ? "bg-red-500" : item.currentStock <= item.reorderLevel ? "bg-amber-500" : "bg-primary"}`}
                        >
                          {item.currentStock === 0 ? "Order Now" : "Reorder"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gray-300">
                          inventory_2
                        </span>
                        <p className="text-gray-500 font-medium">
                          No items found matching your filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium italic">
              Showing {filteredItems.length} of {inventory.length} items
            </p>
            <div className="flex gap-1">
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary font-bold text-xs">
                1
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">info</span>
              <h3 className="text-sm font-bold">Reorder Suggestions</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {inventory.some((i) => i.currentStock <= i.reorderLevel) ? (
                <>
                  Based on your usage patterns, we recommend reordering{" "}
                  <b>
                    {
                      inventory.find((i) => i.currentStock <= i.reorderLevel)
                        ?.name
                    }
                  </b>{" "}
                  soon to avoid stockouts.
                </>
              ) : (
                "All your stock is currently at healthy levels."
              )}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-status-green/20 bg-status-green/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-status-green">
              <span className="material-symbols-outlined text-lg">
                trending_up
              </span>
              <h3 className="text-sm font-bold">Inventory Health</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Your inventory is{" "}
              <b>
                {Math.round(
                  ((inventory.length - (lowStockCount + outOfStockCount)) /
                    inventory.length) *
                    100,
                ) || 100}
                % healthy
              </b>
              .
              {lowStockCount + outOfStockCount > 0
                ? ` Focus on restocking the ${lowStockCount + outOfStockCount} items below reorder levels.`
                : " All items are well-stocked."}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmallBusinessInventory;
