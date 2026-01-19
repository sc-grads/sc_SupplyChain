import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";

const SmallBusinessOrderDetails = () => {
  const { orderId } = useParams();
  const { orders, fetchOrders, updateDeliveryStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const found = orders.find(
      (o) => o.id === orderId || o.orderNumber === orderId,
    );
    if (found) {
      // Re-sync state if context data changed
      if (JSON.stringify(found) !== JSON.stringify(order)) {
        setOrder(found);
      }
    } else if (orders.length === 0) {
      fetchOrders();
    }
  }, [orderId, orders, fetchOrders, order]);

  const handleConfirmDelivery = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const result = await updateDeliveryStatus(order.id, "DELIVERED");
      if (result.success) {
        await fetchOrders();
        alert("Delivery confirmed successfully!");
      } else {
        alert("Server error: " + result.error);
      }
    } catch (error) {
      console.error("Failed to confirm delivery:", error);
      alert("Critical failure: Failed to confirm delivery.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // --- Helpers & Mock Logic ---
  const formatDate = (dateString) => {
    if (!dateString) return "Date N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSupplierName = (o) => {
    const accepted = o.visibility?.find((v) => v.status === "ACCEPTED");
    return accepted?.supplier?.name || o.supplier || "Unknown Supplier";
  };

  // Helper to replicate backend price simulation
  const getMockPrice = (sku) => {
    let hash = 0;
    for (let i = 0; i < sku.length; i++) {
      hash = sku.charCodeAt(i) + ((hash << 5) - hash);
    }
    const price = (Math.abs(hash) % 500) + 50;
    return price;
  };

  const totalCost = order.items?.reduce(
    (sum, item) =>
      sum + (item.price || getMockPrice(item.sku || "UNKNOWN")) * item.quantity,
    0,
  );

  // Status mapping for Progress Bar
  // Steps: Ordered -> Out for Delivery -> Delivered
  let activeStep = 1; // 1 = Ordered (Starting point)
  if (
    order.deliveryState === "OUT_FOR_DELIVERY" ||
    order.deliveryState === "IN_TRANSIT"
  ) {
    activeStep = 2;
  }
  if (order.deliveryState === "DELIVERED") {
    activeStep = 3;
  }

  const getStepClass = (stepIndex) => {
    if (stepIndex <= activeStep) return "bg-emerald-500 text-white"; // Completed or Active now gets a check
    return "bg-slate-200 dark:bg-slate-800 text-slate-500"; // Pending
  };

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Order Details: #{order.orderNumber || order.id}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Placed on {formatDate(order.placedAt)}
                </p>
              </div>

              {(order.deliveryState === "OUT_FOR_DELIVERY" ||
                order.deliveryState === "IN_TRANSIT") && (
                <button
                  onClick={handleConfirmDelivery}
                  disabled={isUpdating}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">
                    task_alt
                  </span>
                  {isUpdating ? "Confirming..." : "Confirm Delivery"}
                </button>
              )}
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-primary text-sm font-semibold rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              {order.deliveryState?.replace(/_/g, " ") || order.orderState}
            </span>
          </div>

          {/* Activity Timeline Section (Horizontal) */}
          <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800">
            <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-10">
              Activity Timeline
            </h3>

            <div className="relative pb-4">
              {/* Horizontal line connector background */}
              <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>

              {/* Active line progress */}
              <div
                className="absolute top-4 left-0 h-1 bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width:
                    activeStep >= 3 ? "100%" : activeStep >= 2 ? "50%" : "0%",
                }}
              ></div>

              <div className="relative flex justify-between">
                {/* Step 1: Order Placed */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-500 text-white z-10 shadow-sm shadow-emerald-500/20">
                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Order Placed
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {order.placedAt
                        ? new Date(order.placedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                      {" · "}
                      {order.placedAt
                        ? new Date(order.placedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Step 2: Out for Delivery */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${activeStep >= 2 ? "bg-emerald-500 text-white shadow-emerald-500/20" : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900"}`}
                  >
                    {activeStep >= 2 && (
                      <span className="material-symbols-outlined text-base">
                        check
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-sm font-bold ${activeStep >= 2 ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}
                    >
                      Out for Delivery
                    </p>
                  </div>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${activeStep >= 3 ? "bg-emerald-500 text-white shadow-emerald-500/20" : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900"}`}
                  >
                    {activeStep >= 3 && (
                      <span className="material-symbols-outlined text-base">
                        check
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-sm font-bold ${activeStep >= 3 ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}
                    >
                      Delivered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Info Grid */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Supplier
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    store
                  </span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {getSupplierName(order)}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Required Date
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {formatDate(order.requiredDeliveryDate)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Cost
              </p>
              <p className="text-xl font-bold text-primary">
                {new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(totalCost)}
              </p>
            </div>
          </section>

          {/* Items Table */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  format_list_bulleted
                </span>
                Order Items
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {order.items.length} Items total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">
                              inventory_2
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white block">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              {item.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {item.quantity} units
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                        {/* Mock price if missing, assuming backend might not send it per item yet */}
                        R {item.price || 50}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                        R {(item.price || 50) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Resilience Actions */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 sticky top-24">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Supplier Performance
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    On-time rate
                  </span>
                  <span className="text-sm font-bold text-emerald-500">
                    98%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Order accuracy
                  </span>
                  <span className="text-sm font-bold text-emerald-500">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </Layout>
  );
};

export default SmallBusinessOrderDetails;
