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
                    Price
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
      </div>
    </Layout>
  );
};

export default Inventory;
