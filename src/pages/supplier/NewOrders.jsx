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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>
              </button>
              <h1 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight leading-none">
                Incoming Requests
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? "s" : ""} awaiting your
              professional fulfillment review
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="space-y-1.5 max-w-md">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
              Search Documentation
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search by customer or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
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
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white dark:bg-gray-900 rounded-lg border ${
                  order.urgent
                    ? "border-risk-amber shadow-sm"
                    : "border-gray-100 dark:border-gray-800 shadow-sm"
                } overflow-hidden transition-all hover:border-primary/20`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Order Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Order #{order.orderNumber}
                        </h3>
                        {order.deliveryStatus === "AT_RISK" && (
                          <span className="px-3 py-1 bg-risk-amber/10 text-risk-amber text-[10px] font-bold rounded-full border border-risk-amber/20 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">
                              warning
                            </span>
                            Priority At Risk
                          </span>
                        )}
                        <StatusBadge
                          status={order.orderState}
                          className="px-4"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                          {order.vendor?.name || "Retailer"}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Authorized {formatRelativeTime(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {order.items?.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-[10px] font-semibold text-gray-400 uppercase tracking-widest rounded-lg border border-gray-100 dark:border-gray-800"
                          >
                            {item.quantity}x {item.name || item.sku}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Line Items
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {order.items?.length || 0} Products
                          </span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Financial Value
                          </span>
                          <span className="text-lg font-bold text-primary">
                            R {order.subtotal || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 min-w-[320px]">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="flex-1 h-11 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                      >
                        Detailed Audit
                      </button>
                      <button
                        onClick={() => handleDeclineOrder(order.id)}
                        className="flex-1 h-11 rounded-lg border border-red-50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-600 text-[10px] font-semibold uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-[1.5] h-11 rounded-lg bg-primary text-white text-[10px] font-semibold uppercase tracking-widest shadow-sm hover:brightness-105 transition-all flex items-center justify-center gap-3"
                      >
                        <span className="material-symbols-outlined text-lg">
                          verified
                        </span>
                        Accept Fulfillment
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
