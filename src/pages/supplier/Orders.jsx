import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../../components/Timeline";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";

// Helper to format relative time (keep your existing function if you have it)
const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Helper to format full date nicely (e.g., "20 January 2026")
const formatFullDate = (dateStr) => {
  if (!dateStr) return "Not specified";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Helper to extract unique months from orders for the filter
const getUniqueMonths = (orders) => {
  if (!orders || orders.length === 0) return ["All"];

  const months = orders.map((order) => {
    const date = new Date(order.createdAt || order.placedAt); // Fallback if field name differs
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  });

  return ["All", ...new Set(months)];
};

// Helper to replicate backend price simulation
const getMockPrice = (sku) => {
  if (!sku) return 50;
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = sku.charCodeAt(i) + ((hash << 5) - hash);
  }
  const price = (Math.abs(hash) % 500) + 50;
  return price;
};

const OrderList = ({ orders, onSelectOrder }) => {
  const getOrderStatus = (order) => {
    if (order.deliveryState === "DELIVERED") return "Delivered";
    if (order.orderState === "ACCEPTED") return "Processing";
    if (order.orderState === "PENDING") return "Confirmed";
    return order.orderState || "Unknown";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "Confirmed":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
              <th className="px-6 py-4">ORDER ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4 text-center">ITEMS</th>
              <th className="px-6 py-4 text-right">TOTAL</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">
                    inbox
                  </span>
                  <p className="text-gray-500 dark:text-gray-400">
                    No orders found
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = getOrderStatus(order);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-6 py-4 font-bold text-sm text-[#121714] dark:text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {order.vendor?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatFullDate(order.createdAt || order.placedAt)}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-sm">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-sm">
                      ZAR{" "}
                      {(
                        (order.items?.reduce(
                          (sum, item) =>
                            sum +
                            (item.price || getMockPrice(item.sku)) *
                              (item.quantity || 0),
                          0,
                        ) || 0) * 1.08
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusClass(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderDetails = ({ order, updateDeliveryStatus, fetchActiveOrders }) => {
  const calculatedSubtotal =
    order.items?.reduce(
      (sum, item) =>
        sum + (item.price || getMockPrice(item.sku)) * (item.quantity || 0),
      0,
    ) || 0;

  // Adapter Logic: Determine Timeline Status
  const getTimelineStatus = () => {
    if (order.deliveryState === "DELIVERED") return "DELIVERED";
    if (
      order.deliveryState === "OUT_FOR_DELIVERY" ||
      order.deliveryState === "IN_TRANSIT"
    ) {
      return "OUT_FOR_DELIVERY";
    }
    // Fallback to events if deliveryState is not set (backwards compatibility)
    if (
      order.events?.some(
        (e) => e.type === "OUT_FOR_DELIVERY" || e.type === "IN_TRANSIT",
      )
    ) {
      return "OUT_FOR_DELIVERY";
    }
    return "PLACED";
  };

  const getTimestamps = () => {
    const placed = order.placedAt || order.createdAt;
    const out = order.events?.find(
      (e) => e.type === "OUT_FOR_DELIVERY",
    )?.timestamp;
    const delivered =
      order.events?.find((e) => e.type === "DELIVERED")?.timestamp ||
      (order.deliveryState === "DELIVERED" ? order.updatedAt : null);

    return {
      placedAt: placed,
      outForDeliveryAt: out,
      deliveredAt: delivered,
    };
  };

  const timelineStatus = getTimelineStatus();
  const timelineTimestamps = getTimestamps();

  const handleOutForDelivery = async () => {
    try {
      const result = await updateDeliveryStatus(order.id, "OUT_FOR_DELIVERY");
      if (!result.success) {
        alert("Server error: " + result.error);
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Critical failure: Failed to update delivery status");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-wider">
              {order.orderState || "Unknown"}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {order.vendor?.name || "Unknown Customer"} • Placed{" "}
            {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOutForDelivery}
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined mr-2">
              local_shipping
            </span>
            <span>Out for Delivery</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
              <a
                className="flex items-center border-b-[3px] border-primary text-primary pb-4 pt-5 px-1 font-bold text-sm tracking-wide"
                href="#"
              >
                Items ({order.items?.length || 0})
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
                    <th className="px-6 py-4">PRODUCT</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-center">QTY</th>
                    <th className="px-6 py-4 text-right">UNIT PRICE</th>
                    <th className="px-6 py-4 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          {/* Static placeholder image – matches screenshot style */}
                          <div
                            className="w-10 h-10 rounded bg-cover bg-center bg-gray-200 dark:bg-gray-700"
                            style={{
                              backgroundImage:
                                "url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=100&h=100&fit=crop')",
                            }}
                          />
                          <span className="font-bold text-sm">
                            {item.name || "Unnamed Product"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {item.sku || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center font-bold">
                          {item.quantity || 0}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          ZAR{" "}
                          {(item.price || getMockPrice(item.sku)).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-sm">
                          ZAR{" "}
                          {(
                            (item.quantity || 0) *
                            (item.price || getMockPrice(item.sku))
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No items in this order
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-background-light/30 dark:bg-background-dark flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>ZAR {calculatedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Tax (8%)</span>
                  <span>ZAR {(calculatedSubtotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#121714] dark:text-white font-black text-xl border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span>ZAR {(calculatedSubtotal * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                  Courier
                </p>
                <p className="font-bold">SwiftLogistics Express</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <span className="material-symbols-outlined">
                  calendar_today
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                  Estimated Delivery
                </p>
                <p className="font-bold">
                  {formatFullDate(order.requiredDeliveryDate)}
                  {order.requiredDeliveryTime
                    ? ` (${order.requiredDeliveryTime})`
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">
              Delivery Info
            </h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-gray-500">
                  location_on
                </span>
                <div>
                  <p className="text-sm font-bold">Shipping Address</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                    {order.vendor?.name || "Unknown Customer"}
                    <br />
                    {order.deliveryAddress || "No address provided"}
                    <br />
                    {order.deliveryLocation
                      ? `${order.deliveryLocation}, South Africa`
                      : ""}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="flex gap-3">
                <span className="material-symbols-outlined text-gray-500">
                  person
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">Point of Contact</p>
                  <p className="text-sm font-medium mt-1">
                    {order.vendor?.name || "Unknown Contact"} (Manager)
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg w-full justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-sm">
                        call
                      </span>
                      {order.vendor?.phone || "+27 000 000 000"}
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-background-light dark:bg-[#2c353d] px-3 py-2 rounded-lg w-full justify-center border border-gray-200 dark:border-gray-700">
                      <span className="material-symbols-outlined text-sm">
                        mail
                      </span>
                      {order.vendor?.email || "Contact via Email"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">
              Activity Timeline
            </h3>
            <div className="relative space-y-8 pl-4">
              <Timeline
                status={timelineStatus}
                timestamps={timelineTimestamps}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Orders = () => {
  const { activeOrders, fetchActiveOrders, updateDeliveryStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");

  const location = useLocation();

  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  useEffect(() => {
    if (location.state?.orderId && activeOrders.length > 0) {
      const orderToSelect = activeOrders.find(
        (o) => o.id === location.state.orderId,
      );
      if (orderToSelect) {
        setSelectedOrder(orderToSelect);
        // Clear state to prevent re-selection on refresh (optional but good practice)
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, activeOrders]);

  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = activeOrders.find((o) => o.id === selectedOrder.id);
      if (updatedOrder) {
        // Only update if something actually changed (status, deliveryState, etc.)
        if (JSON.stringify(updatedOrder) !== JSON.stringify(selectedOrder)) {
          setSelectedOrder(updatedOrder);
        }
      }
    }
  }, [activeOrders, selectedOrder]);

  const availableMonths = getUniqueMonths(activeOrders);

  const filteredOrders =
    selectedMonth === "All"
      ? activeOrders
      : activeOrders.filter((order) => {
          const date = new Date(order.createdAt);
          const orderMonth = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          return orderMonth === selectedMonth;
        });

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6">
          <button
            className={`text-sm font-medium transition-colors ${
              selectedOrder
                ? "text-gray-500 dark:text-gray-400 hover:text-primary"
                : "text-[#121714] dark:text-white font-bold"
            }`}
            onClick={() => setSelectedOrder(null)}
          >
            Orders
          </button>

          {selectedOrder && (
            <>
              <span className="text-gray-500 dark:text-gray-500 text-sm">
                /
              </span>
              <span className="text-[#121714] dark:text-white text-sm font-bold">
                Order #{selectedOrder.orderNumber}
              </span>
            </>
          )}
        </nav>

        {!selectedOrder ? (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight mb-2">
                  Orders
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Manage and track customer orders
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Filter by:
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <OrderList
              orders={filteredOrders}
              onSelectOrder={setSelectedOrder}
            />
          </>
        ) : (
          <OrderDetails
            order={selectedOrder}
            updateDeliveryStatus={updateDeliveryStatus}
            fetchActiveOrders={fetchActiveOrders}
          />
        )}
      </div>
    </Layout>
  );
};

export default Orders;
