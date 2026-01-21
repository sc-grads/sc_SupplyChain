import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";
import { isOrderAtRisk } from "../../utils/orderUtils";

const SmallBusinessDashboard = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Active orders are Accepted by supplier but not yet Delivered
  const activeOrdersCount = orders.filter(
    (order) =>
      order.orderState === "ACCEPTED" && order.deliveryState !== "DELIVERED",
  ).length;

  const atRiskOrders = orders.filter(
    (order) =>
      order.orderState === "ACCEPTED" &&
      order.deliveryState !== "DELIVERED" &&
      isOrderAtRisk(order),
  );

  // Helper to replicate backend price simulation
  const getMockPrice = (sku) => {
    let hash = 0;
    for (let i = 0; i < sku.length; i++) {
      hash = sku.charCodeAt(i) + ((hash << 5) - hash);
    }
    const price = (Math.abs(hash) % 500) + 50;
    return price;
  };

  const calculateOrderTotal = (order) => {
    const subtotal =
      order.subtotal ||
      order.items.reduce((total, item) => {
        const price = item.price || getMockPrice(item.sku || "UNKNOWN");
        return total + price * item.quantity;
      }, 0);
    return subtotal * 1.08; // Include 8% tax
  };

  // Logic: Sum of all ACCEPTED orders that are NOT YET DELIVERED (active financial commitments)
  const estimatedExpenditureVal = orders
    .filter(
      (o) => o.orderState === "ACCEPTED" && o.deliveryState !== "DELIVERED",
    )
    .reduce((sum, order) => sum + calculateOrderTotal(order), 0);

  // Format as Rands
  const estimatedExpenditure = `R ${estimatedExpenditureVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Total Spending: Sum of all DELIVERED orders (Completed transactions)
  const totalSpendingVal = orders
    .filter((o) => o.deliveryState === "DELIVERED")
    .reduce((sum, order) => sum + calculateOrderTotal(order), 0);

  const totalSpending = `R ${totalSpendingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleTrackDelivery = (orderId) => {
    alert(`Opening delivery tracking for order ${orderId}`);
    console.log(`Track delivery: ${orderId}`);
  };

  const handleReorderNow = (itemName) => {
    navigate(
      `/small-business/orders?action=new&item=${encodeURIComponent(itemName)}`,
    );
  };

  const handleQuickReorder = (orderSource) => {
    alert(
      `Quick Reorder triggered for: ${orderSource}. This would pre-fill multiple items.`,
    );
    navigate(`/small-business/orders?action=new`);
  };

  const handleMetricClick = (metric) => {
    alert(`Viewing ${metric} details`);
    console.log(`Metric clicked: ${metric}`);
  };

  // Modal State
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleContactSupplier = (order) => {
    // Find supplier from visibility (Accepted first, then just the first target)
    const supplierVis =
      order.visibility?.find((v) => v.status === "ACCEPTED") ||
      order.visibility?.[0];

    // Fallback Mock Supplier if real data is missing (for demo purposes)
    const mockSupplier = {
      name: "Dairy Distributors Ltd",
      address: "123 Industrial Park, Sandton",
      city: "Johannesburg, South Africa",
      contactPersonName: "Sarah Jenkins (Manager)",
      phone: "+27 82 123 4567",
      email: "orders@dairydist.co.za",
    };

    const supplier = supplierVis?.supplier || mockSupplier;

    if (supplier) {
      setSelectedSupplier(supplier);
      setIsModalOpen(true);
    } else {
      alert("No supplier details available for this order.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isIncoming = (o) => {
    return (
      o.orderState === "ACCEPTED" &&
      o.deliveryState !== "DELIVERED" &&
      (o.deliveryState === "OUT_FOR_DELIVERY" ||
        o.deliveryState === "IN_TRANSIT" ||
        isToday(o.requiredDeliveryDate) ||
        isOrderAtRisk(o))
    );
  };

  // Dynamic Order Segregation
  // 1. Incoming Deliveries: Out for delivery, In Transit, Due Today, or Late
  const incomingOrders = orders
    .filter(isIncoming)
    .sort((a, b) => {
      const aRisk = isOrderAtRisk(a);
      const bRisk = isOrderAtRisk(b);
      if (aRisk && !bRisk) return -1;
      if (!aRisk && bRisk) return 1;
      return (
        new Date(a.requiredDeliveryDate) - new Date(b.requiredDeliveryDate)
      );
    })
    .slice(0, 2);

  // 2. Accepted/Active Orders: Future accepted orders only (not due today or late)
  const confirmedOrders = orders
    .filter(
      (o) =>
        o.orderState === "ACCEPTED" &&
        o.deliveryState !== "DELIVERED" &&
        !isIncoming(o),
    )
    .sort((a, b) => {
      return (
        new Date(a.requiredDeliveryDate) - new Date(b.requiredDeliveryDate)
      );
    })
    .slice(0, 2);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto relative hidden-scrollbar">
        {/* Status Header */}
        <div className="mb-8">
          {atRiskOrders.length > 0 && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined font-bold">
                    warning
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-100">
                    {atRiskOrders.length}{" "}
                    {atRiskOrders.length === 1 ? "Order" : "Orders"} delayed
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400/80">
                    {atRiskOrders.length === 1
                      ? "One of your deliveries is running behind schedule."
                      : "Some of your deliveries are running behind schedule."}
                  </p>
                </div>
              </div>
              <Link
                to={`/small-business/orders/${atRiskOrders[0].id}`}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all"
              >
                Track Now
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            Business Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}{" "}
            — {orders.filter((o) => o.deliveryState === "ON_TRACK").length}{" "}
            deliveries expected soon
          </p>
        </div>

        {/* Spending Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => handleMetricClick("Total Spending")}
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-primary/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-primary material-symbols-outlined text-3xl">
                payments
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                This Month
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Spending
              </p>
              <p className="text-3xl font-bold leading-tight">
                {totalSpending}
              </p>
            </div>
          </div>
          <div
            onClick={() => handleMetricClick("Estimated Expenditure")}
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-status-green/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-status-green material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-status-green/10 text-status-green">
                Committed
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Estimated Expenditure
              </p>
              <p className="text-3xl font-bold leading-tight">
                {estimatedExpenditure}
              </p>
            </div>
          </div>
          <div
            onClick={() => handleMetricClick("Active Orders")}
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-new-blue/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-new-blue material-symbols-outlined text-3xl">
                local_shipping
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-new-blue/10 text-new-blue">
                In Transit
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Active Orders
              </p>
              <p className="text-3xl font-bold leading-tight">
                {activeOrdersCount}
              </p>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-6">
            {/* Incoming Deliveries Section */}
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold">Incoming Deliveries</h2>
              <Link
                to="/small-business/orders"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {incomingOrders.length > 0 ? (
                incomingOrders.slice(0, 2).map((order) => (
                  <div
                    key={order.id}
                    className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-status-green/30 shadow-sm transition-all"
                  >
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          {isOrderAtRisk(order) ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-risk-amber uppercase bg-risk-amber/10 px-2 py-0.5 rounded-full">
                              <span className="size-2 rounded-full bg-risk-amber animate-pulse"></span>
                              Late • {formatDate(order.requiredDeliveryDate)}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-status-green uppercase">
                              <span className="size-2 rounded-full bg-status-green animate-pulse"></span>
                              {order.deliveryState?.replace("_", " ") ||
                                "Expected Soon"}{" "}
                              • {formatDate(order.requiredDeliveryDate)}
                            </span>
                          )}
                          <h3 className="text-lg font-bold">
                            Order #{order.orderNumber}
                          </h3>
                        </div>
                        <span className="text-new-blue material-symbols-outlined">
                          local_shipping
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          Items:
                        </span>{" "}
                        {order.items.length} ({order.items[0]?.name}...)
                      </p>
                      <button
                        onClick={() =>
                          navigate(`/small-business/orders/${order.id}`)
                        }
                        className="w-full bg-primary text-white h-11 rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        Track Delivery
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                  No active incoming deliveries.
                </div>
              )}
            </div>

            {/* Accepted/Confirmed Orders Section */}
            <div className="pt-4 flex items-center justify-between px-2">
              <h2 className="text-lg font-bold">Accepted Orders</h2>
              <span className="text-xs font-bold text-gray-400">
                {confirmedOrders.length} Confirmed
              </span>
            </div>

            <div className="space-y-4">
              {confirmedOrders.length > 0 ? (
                confirmedOrders.slice(0, 2).map((order) => (
                  <div
                    key={order.id}
                    className={`group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border ${order.orderState === "PENDING" ? "border-amber-100 dark:border-amber-900/30" : "border-gray-100 dark:border-gray-800"} shadow-sm`}
                  >
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[10px] font-bold tracking-widest uppercase ${order.orderState === "PENDING" ? "text-risk-amber" : "text-gray-400"}`}
                          >
                            {order.orderState === "PENDING"
                              ? "Awaiting Supplier Confirmation"
                              : "Confirmed • Preparing Shipment"}
                          </span>
                          <h3 className="text-lg font-bold">
                            Order #{order.orderNumber}
                          </h3>
                        </div>
                        {order.orderState === "PENDING" ? (
                          <span className="text-risk-amber material-symbols-outlined">
                            schedule
                          </span>
                        ) : (
                          <span className="bg-status-green/10 text-status-green p-1.5 rounded-full">
                            <span className="material-symbols-outlined text-sm">
                              check_circle
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          Items:
                        </span>{" "}
                        {order.items.length} ({order.items[0]?.name}...)
                      </p>
                      <button
                        onClick={() =>
                          navigate(`/small-business/orders/${order.id}`)
                        }
                        className={`w-full ${order.orderState === "PENDING" ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300" : "bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white"} border h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                      >
                        {order.orderState === "PENDING"
                          ? "Check Status"
                          : "View Order Details"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                  No recently accepted orders.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Low Stock & Quick Reorder */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold">Low Stock Alerts</h2>
                <span className="material-symbols-outlined text-risk-amber">
                  warning
                </span>
              </div>
              <div className="space-y-4">
                {/* Low Stock Item */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Organic Flour 25kg</p>
                      <p className="text-[10px] text-gray-400">
                        Current: 2 bags
                      </p>
                    </div>
                    <span className="text-xs font-bold text-risk-amber">
                      Low Stock
                    </span>
                  </div>
                  <button
                    onClick={() => handleReorderNow("Organic Flour 25kg")}
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-105 transition-all"
                  >
                    Reorder Now
                  </button>
                </div>

                {/* Low Stock Item */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Whole Milk 1L</p>
                      <p className="text-[10px] text-gray-400">
                        Current: 15 units
                      </p>
                    </div>
                    <span className="text-xs font-bold text-risk-amber">
                      Low Stock
                    </span>
                  </div>
                  <button
                    onClick={() => handleReorderNow("Whole Milk 1L")}
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-105 transition-all"
                  >
                    Reorder Now
                  </button>
                </div>

                {/* Out of Stock Item */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Raw Honey 5kg</p>
                      <p className="text-[10px] text-gray-400">
                        Current: 0 jars
                      </p>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      Out of Stock
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/small-business/inventory"
                className="block w-full mt-6 py-3 border border-primary/30 text-primary font-bold text-sm rounded-lg hover:bg-primary/5 transition-colors text-center"
              >
                View Full Inventory
              </Link>
            </div>

            {/* Quick Reorder */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold">Quick Reorder</h2>
                <span className="material-symbols-outlined text-gray-400">
                  history
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickReorder("Weekly Essentials")}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-bold">Weekly Essentials</p>
                  <p className="text-[10px] text-gray-400">12 items • R 450</p>
                </button>
                <button
                  onClick={() => handleQuickReorder("Coffee & Tea")}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-bold">Coffee & Tea</p>
                  <p className="text-[10px] text-gray-400">5 items • R 280</p>
                </button>
                <button
                  onClick={() => handleQuickReorder("Dairy Products")}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-bold">Dairy Products</p>
                  <p className="text-[10px] text-gray-400">8 items • R 320</p>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Supplier Information Modal */}
      {isModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="text-sm font-black tracking-wider text-gray-900 dark:text-white uppercase mb-6">
              Supplier Information
            </h2>

            <div className="space-y-8">
              {/* Supplier Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">
                    location_on
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Supplier Address
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {selectedSupplier.name || "Supplier Name"}
                    <br />
                    {selectedSupplier.address || "123 Supplier Street"}
                    <br />
                    {selectedSupplier.city || "Johannesburg"}
                  </p>
                </div>
              </div>

              {/* Point of Contact */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">
                    person
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Point of Contact
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {selectedSupplier.contactPersonName ||
                      selectedSupplier.name ||
                      "Manager"}
                  </p>

                  <div className="space-y-3 w-full">
                    <a
                      href={`tel:${selectedSupplier.phone || ""}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-status-green/10 text-status-green rounded-lg text-sm font-bold hover:bg-status-green/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        call
                      </span>
                      {selectedSupplier.phone || "+27 000 000 000"}
                    </a>
                    <a
                      href={`mailto:${selectedSupplier.email || ""}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <span className="material-symbols-outlined text-lg">
                        mail
                      </span>
                      {selectedSupplier.email || "supplier@example.com"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SmallBusinessDashboard;
