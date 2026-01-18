import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/common/StatusBadge";
import { useOrders } from "../../context/OrderContext";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

// Mock data for new/pending orders

const NewOrders = () => {
  const navigate = useNavigate();
  const { newRequests, loading, fetchNewRequests, acceptOrder, declineOrder } =
    useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNewRequests();
  }, [fetchNewRequests]);

  const handleAcceptOrder = async (orderId) => {
    if (window.confirm(`Accept order ${orderId}?`)) {
      const result = await acceptOrder(orderId);
      if (result.success) {
        alert(`Order ${orderId} has been accepted!`);
      } else {
        alert(`Failed to accept order: ${result.error}`);
      }
    }
  };

  const handleDeclineOrder = async (orderId) => {
    if (
      window.confirm(
        `Are you sure you want to decline order ${orderId}? This action cannot be undone.`,
      )
    ) {
      const result = await declineOrder(orderId);
      if (result.success) {
        alert(`Order ${orderId} has been declined.`);
      } else {
        alert(`Failed to decline order: ${result.error}`);
      }
    }
  };

  const handleViewDetails = (orderId) => {
    alert(`Viewing full details for order ${orderId}`);
    console.log(`View details: ${orderId}`);
  };

  const filteredOrders = newRequests.filter(
    (order) =>
      (order.vendor?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight">
              New Orders Awaiting Review
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} pending your approval
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
              inbox
            </span>
            <h3 className="text-lg font-bold mb-2">No New Orders</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No orders match your search."
                : "All orders have been reviewed!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white dark:bg-gray-900 rounded-xl border ${
                  order.urgent
                    ? "border-risk-amber shadow-lg shadow-risk-amber/10"
                    : "border-gray-200 dark:border-gray-800"
                } overflow-hidden transition-all hover:shadow-md`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          Order #{order.orderNumber}
                        </h3>
                        {order.deliveryState === "AT_RISK" && (
                          <span className="px-2 py-1 bg-risk-amber/10 text-risk-amber text-xs font-bold rounded-full border border-risk-amber/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              warning
                            </span>
                            At Risk
                          </span>
                        )}
                        <StatusBadge
                          status={order.orderState}
                          className="rounded-full"
                        />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          {order.vendor?.name || "Retailer"}
                        </span>{" "}
                        • {formatRelativeTime(order.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {order.items
                          ?.map((i) => `${i.quantity}x ${i.name || i.sku}`)
                          .join(", ")}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {order.items?.length || 0} item
                          {(order.items?.length || 0) !== 1 ? "s" : ""}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">
                          •
                        </span>
                        <span className="font-bold text-lg">
                          ZAR {order.subtotal || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeclineOrder(order.id)}
                        className="px-4 h-11 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-6 h-11 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">
                          check_circle
                        </span>
                        Accept Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk Actions (if needed in future) */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                info
              </span>
              Review each order carefully before accepting or declining.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewOrders;
