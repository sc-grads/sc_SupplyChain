import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import BentoCard from "../../components/dashboard/BentoCard";
import { useOrders } from "../../context/OrderContext";
import { useInventory } from "../../context/InventoryContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { orders, newRequests, fetchOrders, fetchNewRequests, acceptOrder } =
    useOrders();
  const { inventory, fetchInventory, updateStock } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchNewRequests();
    fetchInventory();
  }, [fetchOrders, fetchNewRequests, fetchInventory]);

  const activeOrdersCount = orders.filter(
    (o) => o.orderState === "ACCEPTED",
  ).length;
  const atRiskCount = orders.filter(
    (o) => o.deliveryState === "AT_RISK",
  ).length;
  const latestNewRequest = newRequests[0];
  const atRiskOrder = orders.find((o) => o.deliveryState === "AT_RISK");
  const activeOrder = orders.find((o) => o.orderState === "ACCEPTED");

  const handleAcceptOrder = (orderId) => {
    alert(`Order ${orderId} accepted!`);
    console.log(`Accepted order: ${orderId}`);
  };

  const handleDeclineOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to decline order ${orderId}?`)) {
      alert(`Order ${orderId} declined`);
      console.log(`Declined order: ${orderId}`);
    }
  };

  const handleUpdateStatus = (orderId) => {
    alert(`Opening status update for order ${orderId}`);
    console.log(`Update status for: ${orderId}`);
  };

  const handleCallRetailer = (retailer) => {
    alert(`Calling ${retailer}...`);
    console.log(`Call retailer: ${retailer}`);
  };

  const handleTrackVehicle = (orderId) => {
    alert(`Opening vehicle tracking for order ${orderId}`);
    console.log(`Track vehicle for: ${orderId}`);
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

            {/* Pinned Risk Card */}
            {atRiskOrder && (
              <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border-l-4 border-risk-amber shadow-[0_4px_20px_rgba(242,184,0,0.1)] transition-all">
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold tracking-widest text-risk-amber uppercase">
                        Delivery at Risk
                      </span>
                      <h3 className="text-lg font-bold">
                        {atRiskOrder.vendor?.name}
                      </h3>
                    </div>
                    <span className="bg-risk-amber/10 text-risk-amber p-1.5 rounded-full">
                      <span className="material-symbols-outlined text-sm">
                        schedule
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      Order #{atRiskOrder.orderNumber}:
                    </span>{" "}
                    {atRiskOrder.items
                      ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                      .join(", ")}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleUpdateStatus(atRiskOrder.id)}
                      className="flex-1 bg-risk-amber text-white h-11 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        report_problem
                      </span>
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New Order Card */}
            {latestNewRequest && (
              <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-new-blue/20 shadow-sm">
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-new-blue uppercase">
                        <span className="size-2 rounded-full bg-new-blue animate-pulse"></span>
                        New Order Received
                      </span>
                      <h3 className="text-lg font-bold">
                        {latestNewRequest.vendor?.name}
                      </h3>
                    </div>
                    <span className="bg-new-blue/10 text-new-blue px-2 py-0.5 rounded text-[10px] font-bold">
                      NEW
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      Order #{latestNewRequest.orderNumber}:
                    </span>{" "}
                    {latestNewRequest.items
                      ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                      .join(", ")}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleAcceptOrder(latestNewRequest.id)}
                      className="flex-1 bg-primary text-white h-11 px-4 rounded-lg font-bold text-sm hover:brightness-110 transition-all"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => navigate("/new-orders")}
                      className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Order Card */}
            {activeOrder && (
              <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        In Progress
                      </span>
                      <h3 className="text-lg font-bold">
                        {activeOrder.vendor?.name}
                      </h3>
                    </div>
                    <span className="text-gray-400 material-symbols-outlined">
                      local_shipping
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      Order #{activeOrder.orderNumber}:
                    </span>{" "}
                    {activeOrder.items
                      ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                      .join(", ")}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleTrackVehicle(activeOrder.id)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Track Delivery
                    </button>
                  </div>
                </div>
              </div>
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
                      <div className="mt-1">
                        {derivedStatus === "AVAILABLE" && (
                          <div
                            style={{ backgroundColor: "rgb(51 153 119)" }}
                            className="px-3 py-1.5 text-white rounded-[8px] text-[10px] font-black uppercase w-full text-center shadow-sm"
                          >
                            In Stock
                          </div>
                        )}
                        {derivedStatus === "LOW" && (
                          <div
                            style={{ backgroundColor: "#ECBD6C" }}
                            className="px-3 py-1.5 text-black rounded-[8px] text-[10px] font-black uppercase w-full text-center shadow-sm"
                          >
                            Low Stock
                          </div>
                        )}
                        {derivedStatus === "UNAVAILABLE" && (
                          <div
                            style={{ backgroundColor: "rgb(185 28 28)" }}
                            className="px-3 py-1.5 text-white rounded-[8px] text-[10px] font-black uppercase w-full text-center shadow-sm"
                          >
                            Unavailable
                          </div>
                        )}
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
    </Layout>
  );
};

export default Dashboard;
