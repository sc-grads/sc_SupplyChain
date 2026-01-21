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
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Today's Status
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase text-xs tracking-widest text-gray-400">
                Live Order Feed
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/new-orders")}
                  className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
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
                    className={`group relative flex items-stretch bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all ${
                      isAtRisk
                        ? "border-l-4 border-risk-amber shadow-sm"
                        : isNew
                          ? "border border-primary/20 shadow-sm"
                          : "border border-gray-100 dark:border-gray-800 shadow-sm"
                    } hover:shadow-sm transition-all`}
                  >
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[10px] font-semibold tracking-widest uppercase ${
                              isAtRisk
                                ? "text-risk-amber"
                                : isNew
                                  ? "text-primary flex items-center gap-1.5"
                                  : "text-gray-400"
                            }`}
                          >
                            {isNew && (
                              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            )}
                            {isNew
                              ? "New Request"
                              : isOrderAtRisk(order)
                                ? "At Risk"
                                : "In Progress"}
                          </span>
                          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            {order.vendor?.name}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isAtRisk ? (
                            <span className="bg-risk-amber/10 text-risk-amber h-8 w-8 rounded-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm">
                                priority_high
                              </span>
                            </span>
                          ) : isNew ? (
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest">
                              NEW
                            </span>
                          ) : (
                            <span className="text-gray-300 material-symbols-outlined text-xl">
                              local_shipping
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {formatRelativeTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
                        <span className="font-semibold text-gray-900 dark:text-white uppercase text-[10px] tracking-widest opacity-50 block mb-1">
                          Order #{order.orderNumber}
                        </span>{" "}
                        {order.items
                          ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                          .join(", ")}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        {isAtRisk ? (
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="flex-1 bg-risk-amber text-white h-11 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xl">
                              edit_notifications
                            </span>
                            Update Status
                          </button>
                        ) : isNew ? (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex-1 bg-primary text-white h-11 px-6 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm"
                            >
                              Accept Request
                            </button>
                            <button
                              onClick={() => handleDeclineOrder(order.id)}
                              className="px-6 h-11 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-all font-medium"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleTrackVehicle(order.id)}
                            className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white h-11 px-6 rounded-lg font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
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
          <aside className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">
                  Stock Availability
                </h2>
                <span className="material-symbols-outlined text-gray-300 text-xl">
                  inventory
                </span>
              </div>
              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  search
                </span>
                <input
                  className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-gray-200"
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
                      className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0"
                    >
                      <div className="flex justify-between items-center px-1">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {item.sku?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                            {item.quantity || 0} / 1000 Units
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-widest ${statusColors[derivedStatus] || "text-gray-400"}`}
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
                className="w-full mt-6 h-11 border border-primary text-primary font-semibold text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary/5 transition-all"
              >
                Manage Bulk Inventory
              </button>
            </div>
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <h3 className="font-semibold text-[10px] uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  lightbulb
                </span>
                Stock Insight
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-lg shadow-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                Risk Management
              </h2>
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mt-2 px-0.5">
                Disruption Awareness Disclosure
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
            <div className="p-6 bg-risk-amber/5 rounded-lg border border-risk-amber/10 space-y-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-risk-amber">
                  warning
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">
                  Active Disruption Warning
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">
                Disclosing a fulfillment delay for{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  Order #{order.orderNumber}
                </span>{" "}
                will trigger immediate stakeholder notifications.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block px-1">
                  Projected Fulfillment Date (ETA)
                </label>
                <input
                  type="datetime-local"
                  value={revisedETA}
                  onChange={(e) => setRevisedETA(e.target.value)}
                  required
                  className="w-full h-11 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-risk-amber/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block px-1">
                  Systemic Root Cause
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Analyze and state the disruption cause..."
                  className="w-full h-32 p-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-risk-amber/20 outline-none transition-all resize-none"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Vehicle Breakdown",
                    "Inventory Shortage",
                    "Traffic Congestion",
                    "Climatic Disruption",
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-[10px] font-semibold uppercase tracking-widest text-gray-400 rounded-lg border border-gray-100 dark:border-gray-800 hover:text-risk-amber hover:border-risk-amber/30 transition-all shadow-sm"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                Retract Report
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[1.5] h-11 bg-risk-amber text-white rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:brightness-105 shadow-sm shadow-risk-amber/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      crisis_alt
                    </span>
                    <span>Confirm Disclosure</span>
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

export default Dashboard;
