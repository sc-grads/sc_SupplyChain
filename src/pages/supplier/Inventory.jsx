import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import InventoryTableRow from "../../components/inventory/InventoryTableRow";
import FilterBar from "../../components/inventory/FilterBar";
import Pagination from "../../components/common/Pagination";
import { useInventory } from "../../context/InventoryContext";

const Inventory = () => {
  const { inventory, loading, fetchInventory, updateStock } = useInventory();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Derived quantity calculations
  const getDerivedStatus = (item) => {
    const percentage = (item.quantity / 1000) * 100;
    if (percentage === 0) return "UNAVAILABLE";
    if (percentage <= 30) return "LOW";
    return "AVAILABLE";
  };

  // Filtering Logic
  const filteredInventory = inventory.filter((item) => {
    const status = getDerivedStatus(item);
    if (activeFilter === "All") return true;
    if (activeFilter === "Low Stock") return status === "LOW";
    if (activeFilter === "Out of Stock") return status === "UNAVAILABLE";
    if (activeFilter === "At Risk") return status === "LOW";
    return true;
  });

  // Derived counts for FilterBar
  const counts = {
    All: inventory.length,
    Low: inventory.filter((i) => getDerivedStatus(i) === "LOW").length,
    OOS: inventory.filter((i) => getDerivedStatus(i) === "UNAVAILABLE").length,
    AtRisk: inventory.filter((i) => getDerivedStatus(i) === "LOW").length,
  };

  const handleStatusUpdate = async (item, newStatus) => {
    const result = await updateStock(item.skuId, null, newStatus);
    if (!result.success) {
      alert(`Status update failed: ${result.error}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Page Heading & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
              Supplier Inventory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Real-time stock control for Warehouse Section B-14
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="opacity-50 cursor-not-allowed flex items-center gap-2 px-4 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#111418] dark:text-white shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">
                cloud_download
              </span>
              Export Manifest
            </button>
            <button
              disabled
              className="opacity-50 cursor-not-allowed flex items-center gap-2 px-4 h-10 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">warning</span>
              Manual Override
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* High Density SKU Table */}
        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Product / SKU
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Stock Level
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Status Toggle
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredInventory.map((item) => (
                  <InventoryTableRow
                    key={item.id}
                    item={item}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination/Footer Density */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredInventory.length}
            itemsPerPage={15}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Quick Edit Overlay Simulation (Hidden normally, here for design representation) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">info</span>
              <h3 className="text-sm font-bold">Quick Adjustment Note</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Use the <b>Quick Edit</b> button on any row to instantly modify
              physical inventory counts. These changes are logged and
              synchronized with active order allocations immediately.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-red-100 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 col-span-2">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-2">
              <span className="material-symbols-outlined text-xl">report</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Safety Warning: Manual Override
              </h3>
            </div>
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed mb-3">
              Manual overrides bypass algorithmic stock safeguards. Only use
              this if the physical count in the warehouse is verified by a floor
              supervisor. This action will trigger a permanent log entry in the
              compliance report.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-red-200 dark:bg-red-900/50 rounded-full">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-red-600">
                CRITICAL ACTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
