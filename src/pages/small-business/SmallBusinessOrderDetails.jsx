import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";
import { isOrderAtRisk } from "../../utils/orderUtils";

const SmallBusinessOrderDetails = () => {
  const { orderId } = useParams();
  const {
    orders,
    fetchOrders,
    updateDeliveryStatus,
    rateOrder,
    getSupplierRating,
  } = useOrders();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [isAccurate, setIsAccurate] = useState(true);
  const [supplierStats, setSupplierStats] = useState({
    averageScore: 0,
    totalRatings: 0,
    accuracyPercentage: 100,
  });

  useEffect(() => {
    fetchOrders(); // Initial fetch
  }, [fetchOrders]);

  useEffect(() => {
    const found = orders.find(
      (o) => o.id === orderId || o.orderNumber === orderId,
    );
    if (found) {
      if (JSON.stringify(found) !== JSON.stringify(order)) {
        setOrder(found);
      }
    }
  }, [orderId, orders, order]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!order) return;
      // Get supplier ID from accepted visibility or order.supplier (if stored as ID, but currently it's name?)
      // Wait, order.supplier is name in mock logic?
      // In schema order has visibility.
      const acceptedVis = order.visibility?.find(
        (v) => v.status === "ACCEPTED",
      );
      const supplierId = acceptedVis?.supplierId;

      if (supplierId) {
        const stats = await getSupplierRating(supplierId);
        setSupplierStats(stats);
      }
    };
    fetchStats();
  }, [order, getSupplierRating]);

  const handleSubmitRating = async () => {
    setIsUpdating(true);
    const result = await rateOrder(order.id, ratingScore, ratingComment);
    setIsUpdating(false);

    if (result.success) {
      setShowRatingModal(false);
      // Refresh stats
      const acceptedVis = order.visibility?.find(
        (v) => v.status === "ACCEPTED",
      );
      if (acceptedVis?.supplierId) {
        const stats = await getSupplierRating(acceptedVis.supplierId);
        setSupplierStats(stats);
      }
      alert("Rating submitted!");
    } else {
      alert("Failed to rate: " + result.error);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const result = await updateDeliveryStatus(order.id, "DELIVERED");
      if (result.success) {
        await fetchOrders();
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

  const isOutForDelivery =
    order.deliveryState === "OUT_FOR_DELIVERY" ||
    order.deliveryState === "IN_TRANSIT" ||
    order.events?.some(
      (e) => e.type === "OUT_FOR_DELIVERY" || e.type === "IN_TRANSIT",
    );

  const isDelivered =
    order.deliveryState === "DELIVERED" ||
    order.events?.some((e) => e.type === "DELIVERED");

  if (isOutForDelivery) {
    activeStep = 2;
  }
  if (isDelivered) {
    activeStep = 3;
  }

  const getEventTimestamp = (type) => {
    const event = order.events?.find((e) => e.type === type);
    return event ? event.timestamp : null;
  };

  const outForDeliveryAt =
    getEventTimestamp("OUT_FOR_DELIVERY") || getEventTimestamp("IN_TRANSIT");
  const deliveredAt = getEventTimestamp("DELIVERED");

  const getStepClass = (stepIndex) => {
    if (stepIndex <= activeStep) return "bg-emerald-500 text-white"; // Completed or Active now gets a check
    return "bg-slate-200 dark:bg-slate-800 text-slate-500"; // Pending
  };

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {isOrderAtRisk(order) && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm shadow-red-500/5 animate-in slide-in-from-top duration-500">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <span className="material-symbols-outlined text-3xl font-bold">
                  error
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-red-900 dark:text-white mb-1">
                  This delivery is at risk
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  We've detected a significant delay. The predicted delivery
                  time is more than 60 minutes later than promised.
                </p>
              </div>
              <button
                onClick={() =>
                  handleContactSupplier?.(order) ||
                  alert("Opening contact for " + getSupplierName(order))
                }
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  call
                </span>
                Contact Supplier
              </button>
            </div>
          )}
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
            <span
              className={`px-3 py-1 ${isOrderAtRisk(order) ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : "bg-emerald-100 dark:bg-emerald-900/30 text-primary border-emerald-200 dark:border-emerald-800"} text-sm font-semibold rounded-full border flex items-center gap-1.5`}
            >
              <span
                className={`w-2 h-2 ${isOrderAtRisk(order) ? "bg-red-500" : "bg-primary"} rounded-full animate-pulse`}
              ></span>
              {isOrderAtRisk(order)
                ? "AT RISK"
                : order.deliveryState?.replace(/_/g, " ") || order.orderState}
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
                className={`absolute top-4 left-0 h-1 rounded-full transition-all duration-500 
                  ${isOrderAtRisk(order) ? "bg-red-500" : "bg-emerald-500"}`}
                style={{
                  width:
                    activeStep >= 3
                      ? "100%"
                      : activeStep >= 2
                        ? "50%"
                        : isOrderAtRisk(order)
                          ? "50%"
                          : "0%",
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

                {/* Step 2: Out for Delivery (or At Risk) */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm transition-colors duration-300
                      ${activeStep >= 2 ? (isOrderAtRisk(order) ? "bg-red-500 shadow-red-500/20" : "bg-emerald-500 shadow-emerald-500/20") : isOrderAtRisk(order) ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-600" : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900"}`}
                  >
                    {activeStep >= 2 ? (
                      <span className="material-symbols-outlined text-base text-white">
                        check
                      </span>
                    ) : (
                      isOrderAtRisk(order) && (
                        <span className="material-symbols-outlined text-base animate-pulse">
                          warning
                        </span>
                      )
                    )}
                  </div>
                  <div className="mt-4">
                    <p
                      className={`text-sm font-bold 
                        ${activeStep >= 2 || isOrderAtRisk(order) ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}
                        ${isOrderAtRisk(order) && activeStep < 2 ? "text-red-600 dark:text-red-400" : ""}`}
                    >
                      {isOrderAtRisk(order) && activeStep < 2
                        ? "Delivery Delayed"
                        : "Out for Delivery"}
                    </p>
                    {outForDeliveryAt && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(outForDeliveryAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {new Date(outForDeliveryAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm 
                      ${activeStep >= 3 ? "bg-emerald-500 text-white shadow-emerald-500/20" : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900"}`}
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
                    {deliveredAt && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(deliveredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {new Date(deliveredAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
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
                Total Cost (Inc. Tax)
              </p>
              <p className="text-xl font-bold text-primary">
                R {(totalCost * 1.08).toFixed(2)}
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
                        R {(item.price || getMockPrice(item.sku)).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                        R{" "}
                        {(
                          (item.price || getMockPrice(item.sku)) * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Box */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Subtotal
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    R {totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Tax (8%)
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    R {(totalCost * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-2xl font-black text-primary">
                    R {(totalCost * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Resilience Actions */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 sticky top-24">
            <div className="space-y-4">
              <button
                onClick={handleConfirmDelivery}
                disabled={
                  isUpdating ||
                  order.deliveryState === "DELIVERED" ||
                  !isOutForDelivery
                }
                className="w-full mb-4 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10"
              >
                <span className="material-symbols-outlined text-base">
                  task_alt
                </span>
                {isUpdating ? "Updating..." : "Mark as Delivered"}
              </button>

              {order.deliveryState === "DELIVERED" && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full mb-4 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    star
                  </span>
                  Rate Supplier
                </button>
              )}

              {showRatingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Rate Supplier
                    </h3>
                    <div className="flex gap-2 justify-center mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRatingScore(star)}
                          className={`text-3xl transition-transform hover:scale-110 ${ratingScore >= star ? "text-yellow-400 font-variation-FILL" : "text-gray-300"}`}
                        >
                          <span className="material-symbols-outlined filled">
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Order Accurate?
                      </span>
                      <button
                        onClick={() => setIsAccurate(!isAccurate)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${isAccurate ? "bg-emerald-500" : "bg-gray-300"}`}
                      >
                        <span
                          className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAccurate ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>

                    <textarea
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-none focus:ring-2 focus:ring-primary mb-4"
                      placeholder="Optional comment..."
                      rows="3"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRatingModal(false)}
                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        disabled={isUpdating}
                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark"
                      >
                        {isUpdating ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Supplier Performance
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    On-time rate
                  </span>
                  <span className="text-sm font-bold text-emerald-500">
                    {supplierStats.totalRatings > 0
                      ? `${Math.round((supplierStats.averageScore / 5) * 100)}%`
                      : "N/A"}
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({supplierStats.totalRatings} ratings)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Order accuracy
                  </span>
                  <span className="text-sm font-bold text-emerald-500">
                    {supplierStats.totalRatings > 0
                      ? `${supplierStats.accuracyPercentage || 100}%`
                      : "100%"}
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
