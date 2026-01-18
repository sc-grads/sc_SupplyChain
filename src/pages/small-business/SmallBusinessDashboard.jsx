import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const SmallBusinessDashboard = () => {
  const navigate = useNavigate();

  const handleTrackDelivery = (orderId) => {
    alert(`Opening delivery tracking for order ${orderId}`);
    console.log(`Track delivery: ${orderId}`);
  };

  const handleViewDetails = (orderId) => {
    alert(`Viewing details for order ${orderId}`);
    navigate("/small-business/orders");
  };

  const handleContactSupplier = (supplier) => {
    alert(`Contacting ${supplier}...`);
    console.log(`Contact supplier: ${supplier}`);
  };

  const handleReorderNow = (product) => {
    alert(`Reordering ${product}`);
    console.log(`Reorder: ${product}`);
  };

  const handleQuickReorder = (template) => {
    alert(`Reordering template: ${template}`);
    console.log(`Quick reorder: ${template}`);
  };

  const handleMetricClick = (metric) => {
    alert(`Viewing ${metric} details`);
    console.log(`Metric clicked: ${metric}`);
  };
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto">
        {/* Status Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Business Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monday, Oct 14th — 2 deliveries expected today
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
              <p className="text-3xl font-bold leading-tight">$12,450</p>
            </div>
          </div>
          <div
            onClick={() => handleMetricClick("Budget Remaining")}
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-status-green/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-status-green material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-status-green/10 text-status-green">
                62% Used
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Budget Remaining
              </p>
              <p className="text-3xl font-bold leading-tight">$7,550</p>
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
              <p className="text-3xl font-bold leading-tight">5</p>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold">Incoming Deliveries</h2>
              <div className="flex gap-2">
                <Link
                  to="/small-business/orders"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all orders
                </Link>
              </div>
            </div>

            {/* Expected Today - Delivery Card */}
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border-l-4 border-status-green shadow-[0_4px_20px_rgba(34,197,94,0.1)] transition-all">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-status-green uppercase">
                      <span className="size-2 rounded-full bg-status-green animate-pulse"></span>
                      Arriving Today • Expected 2:00 PM
                    </span>
                    <h3 className="text-lg font-bold">
                      Fresh Farm Supplies Co.
                    </h3>
                  </div>
                  <span className="bg-status-green/10 text-status-green p-1.5 rounded-full">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    Order #ORD-4521:
                  </span>{" "}
                  50kg Organic Flour, 20L Olive Oil, 30kg Sugar
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleTrackDelivery("ORD-4521")}
                    className="flex-1 bg-status-green text-white h-11 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>
                    Track Delivery
                  </button>
                  <button
                    onClick={() => handleViewDetails("ORD-4521")}
                    className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div
                className="hidden sm:block w-40 bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop")',
                }}
              ></div>
            </div>

            {/* In Transit Card */}
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-new-blue/20 shadow-sm">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-widest text-new-blue uppercase">
                      In Transit • Expected Tomorrow
                    </span>
                    <h3 className="text-lg font-bold">
                      Premium Coffee Roasters
                    </h3>
                  </div>
                  <span className="text-new-blue material-symbols-outlined">
                    local_shipping
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    Order #ORD-4518:
                  </span>{" "}
                  10kg Espresso Beans, 5kg Colombian Blend
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleTrackDelivery("ORD-4518")}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Track Shipment
                  </button>
                </div>
              </div>
            </div>

            {/* Pending Confirmation Card */}
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Pending Confirmation
                    </span>
                    <h3 className="text-lg font-bold">
                      Dairy Distributors Ltd
                    </h3>
                  </div>
                  <span className="text-gray-400 material-symbols-outlined">
                    schedule
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    Order #ORD-4525:
                  </span>{" "}
                  100L Whole Milk, 50kg Butter, 200 Eggs
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() =>
                      handleContactSupplier("Dairy Distributors Ltd")
                    }
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Contact Supplier
                  </button>
                </div>
              </div>
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
                  <button
                    onClick={() => handleReorderNow("Raw Honey 5kg")}
                    className="w-full py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:brightness-105 transition-all"
                  >
                    Order Urgently
                  </button>
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
                  <p className="text-[10px] text-gray-400">12 items • $450</p>
                </button>
                <button
                  onClick={() => handleQuickReorder("Coffee & Tea")}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-bold">Coffee & Tea</p>
                  <p className="text-[10px] text-gray-400">5 items • $280</p>
                </button>
                <button
                  onClick={() => handleQuickReorder("Dairy Products")}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-bold">Dairy Products</p>
                  <p className="text-[10px] text-gray-400">8 items • $320</p>
                </button>
              </div>
            </div>

            {/* Spending Insight */}
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  lightbulb
                </span>
                Spending Insight
              </h3>
              <p className="text-xs leading-relaxed text-primary/80">
                You're spending <strong>15% less</strong> this month compared to
                last month. Great job managing your budget!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default SmallBusinessDashboard;
