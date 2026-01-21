import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../../components/Timeline";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/common/StatusBadge";
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
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase font-semibold tracking-widest text-gray-400">
              <th className="px-6 py-4">ORDER ID</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4 text-center">ITEMS</th>
              <th className="px-6 py-4 text-right">TOTAL</th>
              <th className="px-6 py-4 text-center">STATUS</th>
              <th className="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">
                    inbox
                  </span>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                    No orders found
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const deliveryStatus = order.deliveryState || "PENDING";
                const orderState = order.orderState || "PENDING";
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-6 py-5 font-bold text-sm text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {order.vendor?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          {order.deliveryLocation || "No Location"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500">
                      {formatFullDate(order.createdAt || order.placedAt)}
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-sm text-gray-900 dark:text-white">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-sm text-gray-900 dark:text-white">
                      R{" "}
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
                    <td className="px-6 py-5 text-center">
                      <StatusBadge
                        status={
                          deliveryStatus === "DELIVERED"
                            ? "DELIVERED"
                            : orderState
                        }
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-xl">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h1 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight leading-none">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge
              status={order.orderState}
              className="text-[10px] px-4"
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Authorized by {order.vendor?.name || "Unknown Customer"} • Placed{" "}
            {formatFullDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOutForDelivery}
            className="h-11 px-6 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-105 transition-all shadow-sm flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">
              local_shipping
            </span>
            Mark Out for Delivery
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
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase font-semibold tracking-widest text-gray-400">
                    <th className="px-6 py-4">PRODUCT</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-center">QTY</th>
                    <th className="px-6 py-4 text-right">UNIT PRICE</th>
                    <th className="px-6 py-4 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg bg-cover bg-center border border-gray-100 dark:border-gray-800"
                              style={{
                                backgroundImage:
                                  "url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=100&h=100&fit=crop')",
                              }}
                            />
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {item.name || "Unnamed Product"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            {item.sku || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center font-bold text-sm text-gray-900 dark:text-white">
                          {item.quantity || 0}
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-gray-900 dark:text-white">
                          R {(item.price || getMockPrice(item.sku)).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-sm text-gray-900 dark:text-white">
                          R{" "}
                          {(
                            (item.quantity || 0) *
                            (item.price || getMockPrice(item.sku))
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          No items in this order
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-gray-50/30 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    R {calculatedSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Tax (8%)
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    R {(calculatedSubtotal * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    R {(calculatedSubtotal * 1.08).toFixed(2)}
                  </span>
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
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-widest">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-widest">
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
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
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
                    <a
                      href={`tel:${order.vendor?.phone || ""}`}
                      className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg w-full justify-center border border-primary/20 hover:bg-primary/20 transition-all text-center no-underline"
                    >
                      <span className="material-symbols-outlined text-sm">
                        call
                      </span>
                      {order.vendor?.phone || "+27 000 000 000"}
                    </a>
                    <a
                      href={`mailto:${order.vendor?.email || ""}?subject=Regarding Order #${order.orderNumber}&body=Hello ${order.vendor?.name || "Customer"},%0D%0A%0D%0AI am contacting you regarding order #${order.orderNumber}...`}
                      className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-background-light dark:bg-[#2c353d] px-3 py-2 rounded-lg w-full justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center no-underline"
                    >
                      <span className="material-symbols-outlined text-sm">
                        mail
                      </span>
                      {order.vendor?.email || "Contact via Email"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div className="space-y-1">
                <h1 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight leading-none">
                  Order Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Monitor and track real-time fulfillment across all active
                  customers
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5 min-w-[200px]">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
                    Filter by Period
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {month === "All" ? "All History" : month}
                      </option>
                    ))}
                  </select>
                </div>
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
