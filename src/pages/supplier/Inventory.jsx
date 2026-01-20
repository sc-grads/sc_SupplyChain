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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(quantity) > 1000) {
      setError("Stock level cannot exceed 1000 units.");
      return;
    }
    setError("");
    setLoading(true);
    await onSave(item.skuId, quantity, item.status, price);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111418] rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-lg font-bold">Edit Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Product
            </label>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {item?.sku?.name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Price (R)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full h-10 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Stock Level
              </label>
              <input
                type="number"
                required
                max="1000"
                className={`w-full h-10 px-3 bg-gray-50 dark:bg-gray-800 border ${parseInt(quantity) > 1000 ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 dark:border-gray-700"} rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary outline-none`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
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
            itemsPerPage={15}
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
