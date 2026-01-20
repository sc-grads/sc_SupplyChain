import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import BentoCard from "../../components/dashboard/BentoCard";
import { useOrders } from "../../context/OrderContext";
import { useInventory } from "../../context/InventoryContext";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { isOrderAtRisk } from "../../utils/orderUtils";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    orders,
    newRequests,
    fetchOrders,
    fetchNewRequests,
    acceptOrder,
    declineOrder,
    activeOrders,
    fetchActiveOrders,
    reportDelay,
  } = useOrders();
  const { inventory, fetchInventory, updateStock } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Reporting Delay
  const [delayOrder, setDelayOrder] = useState(null);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchNewRequests();
    fetchInventory();
    fetchActiveOrders();
  }, [fetchOrders, fetchNewRequests, fetchInventory, fetchActiveOrders]);

  const activeOrdersCount = activeOrders.length;
  const atRiskCount = orders.filter(
    (o) => o.deliveryState === "AT_RISK" || isOrderAtRisk(o),
  ).length;

  // Get orders for live feed - limit to 3 total
  const atRiskOrders = orders.filter(
    (o) => o.deliveryState === "AT_RISK" || isOrderAtRisk(o),
  );
  const newRequestsOrders = newRequests;

  // Combine and unique-ify orders for live feed (limit to 3 total)
  const combinedOrders = [
    ...atRiskOrders.map((o) => ({ ...o, feedType: "at-risk" })),
    ...newRequestsOrders.map((o) => ({ ...o, feedType: "new" })),
    ...activeOrders.map((o) => ({ ...o, feedType: "active" })),
  ];

  // Remove duplicates by ID, prioritizing at-risk > new > active
  const uniqueOrdersMap = new Map();
  combinedOrders.forEach((o) => {
    if (!uniqueOrdersMap.has(o.id)) {
      uniqueOrdersMap.set(o.id, o);
    }
  });

  const liveFeedOrders = Array.from(uniqueOrdersMap.values()).slice(0, 3);

  const handleAcceptOrder = async (orderId) => {
    const result = await acceptOrder(orderId);
    if (result.success) {
      console.log(`Accepted order: ${orderId}`);
    } else {
      alert(`Error accepting order: ${result.error}`);
    }
  };

  const handleDeclineOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to decline order ${orderId}?`)) {
      const result = await declineOrder(orderId);
      if (result.success) {
        console.log(`Declined order: ${orderId}`);
      } else {
        alert(`Error declining order: ${result.error}`);
      }
    }
  };

  const handleUpdateStatus = (order) => {
    setDelayOrder(order);
    setIsDelayModalOpen(true);
  };

  const handleCallRetailer = (retailer) => {
    alert(`Calling ${retailer}...`);
    console.log(`Call retailer: ${retailer}`);
  };

  const handleTrackVehicle = (orderId) => {
    navigate("/orders", { state: { orderId } });
  };

  const handleStockUpdate = async (skuId, status) => {
    // Mapping display labels to API statuses
    const statusMap = {
      Available: "AVAILABLE",
      "Low Stock": "LOW",
      "Out of Stock": "UNAVAILABLE",
    };
    const apiStatus = statusMap[status] || status;
    const result = await updateStock(skuId, null, apiStatus); // Null quantity means we only update status
    if (result.success) {
      console.log(`Successfully updated status for ${skuId} to ${apiStatus}`);
    } else {
      alert(`Error updating stock: ${result.error}`);
    }
  };

  const handleBulkInventory = () => {
    navigate("/inventory");
  };

  const filteredInventory = inventory
    .filter(
      (item) =>
        item.sku?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.code?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 3);

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto">
        {/* Status Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Today's Status</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}{" "}
            — {newRequests.length + atRiskCount}{" "}
            {newRequests.length + atRiskCount === 1 ? "update" : "updates"}{" "}
            require your attention
          </p>
        </div>

        {/* Bento Grid Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BentoCard
            title="New Orders"
            value={newRequests.length}
            icon="fiber_new"
            trend={`${newRequests.length} awaiting`}
            trendLabel="Awaiting Review"
            trendColor="text-new-blue"
            trendBg="bg-new-blue/10"
            iconColor="text-new-blue"
            borderColor="border-new-blue/30"
            onClick={() => {
              navigate("/new-orders");
            }}
          />
          <BentoCard
            title="Active Orders"
            value={activeOrdersCount}
            icon="pending_actions"
            trend="Current active"
            trendLabel="In Progress"
            trendColor="text-primary"
            trendBg="bg-primary/10"
            iconColor="text-primary"
            borderColor="border-primary/30"
            onClick={() => {
              navigate("/orders");
            }}
          />
          <BentoCard
            title="Orders at Risk"
            value={atRiskCount}
            icon="warning_amber"
            trend={atRiskCount > 0 ? "Needs Action" : "All Clear"}
            trendLabel={atRiskCount > 0 ? "Needs Action" : "All Clear"}
            trendColor="text-risk-amber"
            trendBg="bg-risk-amber/10"
            iconColor="text-risk-amber"
            borderColor="border-risk-amber/30"
            shadowColor="shadow-risk-amber/5"
            onClick={() => {
              navigate("/orders");
            }}
          />
        </div>

        {/* Main Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold">Live Order Feed</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/new-orders")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>
            </div>

            {/* Live Feed Orders - Limited to 3 */}
            {liveFeedOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                  inbox
                </span>
                <h3 className="text-lg font-bold mb-2">No Active Orders</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  All orders have been processed!
                </p>
              </div>
            ) : (
              liveFeedOrders.map((order) => {
                const isAtRisk = order.feedType === "at-risk";
                const isNew = order.feedType === "new";
                const isActive = order.feedType === "active";

                return (
                  <div
                    key={order.id}
                    className={`group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden ${
                      isAtRisk
                        ? "border-l-4 border-risk-amber shadow-[0_4px_20px_rgba(242,184,0,0.1)]"
                        : isNew
                          ? "border border-new-blue/20 shadow-sm"
                          : "border border-gray-100 dark:border-gray-800 shadow-sm"
                    } transition-all`}
                  >
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[10px] font-bold tracking-widest uppercase ${
                              isAtRisk
                                ? "text-risk-amber"
                                : isNew
                                  ? "text-new-blue flex items-center gap-1.5"
                                  : "text-gray-400"
                            }`}
                          >
                            {isNew && (
                              <span className="size-2 rounded-full bg-new-blue animate-pulse"></span>
                            )}
                            {isAtRisk
                              ? "Delivery at Risk"
                              : isNew
                                ? "New Order Received"
                                : isOrderAtRisk(order)
                                  ? "At Risk"
                                  : "In Progress"}
                          </span>
                          <h3 className="text-lg font-bold">
                            {order.vendor?.name}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isAtRisk ? (
                            <span className="bg-risk-amber/10 text-risk-amber p-1.5 rounded-full">
                              <span className="material-symbols-outlined text-sm">
                                schedule
                              </span>
                            </span>
                          ) : isNew ? (
                            <span className="bg-new-blue/10 text-new-blue px-2 py-0.5 rounded text-[10px] font-bold">
                              NEW
                            </span>
                          ) : (
                            <span className="text-gray-400 material-symbols-outlined">
                              local_shipping
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          Order #{order.orderNumber}:
                        </span>{" "}
                        {order.items
                          ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                          .join(", ")}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        {isAtRisk ? (
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="flex-1 bg-risk-amber text-white h-11 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">
                              report_problem
                            </span>
                            Update Status
                          </button>
                        ) : isNew ? (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex-1 bg-primary text-white h-11 px-4 rounded-lg font-bold text-sm hover:brightness-110 transition-all"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleDeclineOrder(order.id)}
                              className="px-4 h-11 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleTrackVehicle(order.id)}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            Track Delivery
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Sidebar: Inventory Quick Controls */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold">Stock Availability</h2>
                <span className="material-symbols-outlined text-gray-400">
                  inventory
                </span>
              </div>
              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Search SKUs..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                {filteredInventory.map((item) => {
                  const percentage = ((item.quantity || 0) / 1000) * 100;
                  let derivedStatus = "AVAILABLE";
                  if (percentage === 0) derivedStatus = "UNAVAILABLE";
                  else if (percentage <= 30) derivedStatus = "LOW";

                  const statusColors = {
                    AVAILABLE: "text-primary",
                    LOW: "text-risk-amber",
                    UNAVAILABLE: "text-red-500",
                  };
                  const statusLabels = {
                    AVAILABLE: "In Stock",
                    LOW: "Low Stock",
                    UNAVAILABLE: "Unavailable",
                  };

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">
                            {item.sku?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Current Stock: {item.quantity || 0} / 1000
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold ${statusColors[derivedStatus] || "text-gray-400"}`}
                        >
                          {statusLabels[derivedStatus] || derivedStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleBulkInventory}
                className="w-full mt-6 py-3 border border-primary/30 text-primary font-bold text-sm rounded-lg hover:bg-primary/5 transition-colors"
              >
                Manage Bulk Inventory
              </button>
            </div>
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  lightbulb
                </span>
                Stock Insight
              </h3>
              <p className="text-xs leading-relaxed text-primary/80">
                Demand for <strong>Artisan Sourdough</strong> is up 40% in your
                area. Consider increasing production for the weekend.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <ReportDelayModal
        isOpen={isDelayModalOpen}
        onClose={() => setIsDelayModalOpen(false)}
        order={delayOrder}
        onSave={reportDelay}
      />
    </Layout>
  );
};

const ReportDelayModal = ({ isOpen, onClose, order, onSave }) => {
  const [revisedETA, setRevisedETA] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order?.predictedDeliveryAt || order?.promisedDeliveryAt) {
      const baseDate = order.predictedDeliveryAt || order.promisedDeliveryAt;
      const date = new Date(baseDate);
      // Format to yyyy-MM-ddThh:mm for datetime-local
      const formatted = date.toISOString().slice(0, 16);
      setRevisedETA(formatted);
    }
  }, [order]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onSave(order.id, revisedETA, reason);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      alert("Error reporting delay: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Report Delay
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                Order #{order?.orderNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">
                close
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">
                Revised Estimated Arrival (ETA)
              </label>
              <input
                type="datetime-local"
                value={revisedETA}
                onChange={(e) => setRevisedETA(e.target.value)}
                required
                className="w-full h-14 px-5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-[#121615] dark:text-white focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">
                Reason for Delay
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Select or enter reason..."
                className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-[#121615] dark:text-white focus:border-primary transition-all outline-none min-h-[120px] resize-none"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Vehicle Breakdown",
                  "Inventory Shortage",
                  "Traffic Delay",
                  "Route Adjustment",
                ].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-14 bg-risk-amber text-white rounded-2xl font-bold hover:brightness-110 shadow-lg shadow-risk-amber/20 transition-all disabled:opacity-50"
              >
                {loading ? "Reporting..." : "Send Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
