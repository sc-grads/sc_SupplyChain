import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import InventoryTableRow from "../../components/inventory/InventoryTableRow";
import FilterBar from "../../components/inventory/FilterBar";
import Pagination from "../../components/common/Pagination";
import { useInventory } from "../../context/InventoryContext";

const EditInventoryModal = ({ item, isOpen, onClose, onSave }) => {
  const [price, setPrice] = useState(item?.price || 0);
  const [quantity, setQuantity] = useState(item?.quantity || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setPrice(item.price || 0);
      setQuantity(item.quantity || 0);
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(quantity) > 1000) {
      setError("Asset quantity threshold exceeded (Max: 1000).");
      return;
    }
    setError("");
    setLoading(true);
    await onSave(item.skuId, quantity, item.status, price);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-lg shadow-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                Inventory Control
              </h2>
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mt-2 px-0.5">
                Asset Revaluation Protocol
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 text-[10px] font-semibold uppercase tracking-widest rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
                Identified Asset
              </label>
              <p className="text-lg font-bold text-gray-900 dark:text-white px-1 leading-tight">
                {item?.sku?.name || "Standard Unit SKU"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary px-1 opacity-70">
                {item?.skuId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block px-1">
                  Unit Valuation (R)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full h-11 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block px-1">
                  Stock Volume
                </label>
                <input
                  type="number"
                  required
                  max="1000"
                  className={`w-full h-11 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all ${parseInt(quantity) > 1000 ? "ring-2 ring-red-500/50" : ""}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                Abort Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[1.5] h-11 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-105 shadow-sm shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      verified_user
                    </span>
                    <span>Commit Updates</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { inventory, loading, fetchInventory, updateStock } = useInventory();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Derived quantity calculations
  const getDerivedStatus = (item) => {
    const percentage = ((item.quantity || 0) / 1000) * 100;
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

  // Slicing for Pagination
  const itemsPerPage = 7;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Derived counts for FilterBar
  const counts = {
    All: inventory.length,
    Low: inventory.filter((i) => getDerivedStatus(i) === "LOW").length,
    OOS: inventory.filter((i) => getDerivedStatus(i) === "UNAVAILABLE").length,
    AtRisk: inventory.filter((i) => getDerivedStatus(i) === "LOW").length,
  };

  const handleStatusUpdate = async (skuId, quantity, status, price) => {
    const result = await updateStock(skuId, quantity, status, price);
    if (!result.success) {
      alert(`Update failed: ${result.error}`);
    } else {
      fetchInventory(); // Ensure we have latest data
    }
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Page Heading & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="space-y-1">
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
              className="flex items-center justify-center gap-2 px-4 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-400 dark:text-gray-500 shadow-sm transition-all"
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
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Product / SKU
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                    Stock Level
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                    Live Status
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedInventory.map((item) => (
                  <InventoryTableRow
                    key={item.id}
                    item={item}
                    onStatusUpdate={handleStatusUpdate}
                    onEdit={setEditingItem}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination/Footer Density */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredInventory.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Edit Modal */}
        <EditInventoryModal
          isOpen={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleStatusUpdate}
        />
      </div>
    </Layout>
  );
};

export default Inventory;
