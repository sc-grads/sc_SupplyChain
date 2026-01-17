import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleStockUpdate = (product, status) => {
    alert(`${product} stock updated to: ${status}`);
    console.log(`Stock update - ${product}: ${status}`);
  };

  const handleBulkInventory = () => {
    navigate("/inventory");
  };

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto">
        {/* Status Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Today's Status</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monday, Oct 14th — 3 updates require your attention
          </p>
        </div>

        {/* Bento Grid Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-new-blue/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              alert("Viewing new orders");
              navigate("/orders");
            }}
          >
            <div className="flex justify-between items-start">
              <span className="text-new-blue material-symbols-outlined text-3xl">
                fiber_new
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-new-blue/10 text-new-blue">
                +20% vs yesterday
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                New Orders
              </p>
              <p className="text-3xl font-bold leading-tight">2</p>
            </div>
          </div>
          <div
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-primary/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              alert("Viewing active orders");
              navigate("/orders");
            }}
          >
            <div className="flex justify-between items-start">
              <span className="text-primary material-symbols-outlined text-3xl">
                pending_actions
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                +5% vs yesterday
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Active Orders
              </p>
              <p className="text-3xl font-bold leading-tight">8</p>
            </div>
          </div>
          <div
            className="bento-card flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-gray-900 border border-risk-amber/30 shadow-lg shadow-risk-amber/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              alert("Viewing at-risk orders");
              console.log("Show at-risk orders");
            }}
          >
            <div className="flex justify-between items-start">
              <span className="text-risk-amber material-symbols-outlined text-3xl">
                warning_amber
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-risk-amber/10 text-risk-amber">
                Needs Action
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Orders at Risk
              </p>
              <p className="text-3xl font-bold leading-tight">1</p>
            </div>
          </div>
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
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border-l-4 border-risk-amber shadow-[0_4px_20px_rgba(242,184,0,0.1)] transition-all">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-widest text-risk-amber uppercase">
                      Delivery at Risk • 4:00 PM
                    </span>
                    <h3 className="text-lg font-bold">
                      Green Grocer - Downtown
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
                    Order #ORD-8821:
                  </span>{" "}
                  12x Organic Milk, 24x Eggs, 5kg Fresh Spinach
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleUpdateStatus("ORD-8821")}
                    className="flex-1 bg-risk-amber text-white h-11 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">
                      report_problem
                    </span>
                    Update Status
                  </button>
                  <button
                    onClick={() => handleCallRetailer("Green Grocer - Downtown")}
                    className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Call Retailer
                  </button>
                </div>
              </div>
              <div
                className="hidden sm:block w-40 bg-center bg-no-repeat bg-cover"
                data-alt="Grocery storefront with fresh produce"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-k5pDHmsD0JkvzaOdWmU95LsWi5ZGZ0etXgfYjmA6ioY9YQx1_TwuM731WCFDIdtd7vBQnUKl2dfHsMp9opQQJtKku2bgvSe3rbZrmY3zdMalFlQhRwCJlXJSMwLLM4WOJ-Tpw_KDu3Fz8AIfGSpPxxU_9lw5mbf-EXi5j8hUGXxHaiITWIqX1hHB3WRd87XzCV76ZP6vf_Bq4WjyuJ5V48dDMWPOh7rgnieJlQaArPf_v_0Vqfjd5dsMnaQyN46riNLfDDhsqt35")',
                }}
              ></div>
            </div>

            {/* New Order Card */}
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-new-blue/20 shadow-sm">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-new-blue uppercase">
                      <span className="size-2 rounded-full bg-new-blue animate-pulse"></span>
                      New Order Received • 2 mins ago
                    </span>
                    <h3 className="text-lg font-bold">The Healthy Hub</h3>
                  </div>
                  <span className="bg-new-blue/10 text-new-blue px-2 py-0.5 rounded text-[10px] font-bold">
                    NEW
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    Order #ORD-9104:
                  </span>{" "}
                  30x Artisan Sourdough, 10kg Salted Butter
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleAcceptOrder("ORD-9104")}
                    className="flex-1 bg-primary text-white h-11 px-4 rounded-lg font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleDeclineOrder("ORD-9104")}
                    className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
              <div
                className="hidden sm:block w-40 bg-center bg-no-repeat bg-cover grayscale group-hover:grayscale-0 transition-all"
                data-alt="Close up of artisan sourdough bread"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVMi4TQcSBGRnt5ovssN0IzxoeNcv9u3qkV7BVMF71NEdovTLa71OlqyTNNPyjPMZCLZwKrbukOj1AyA9PvdQB8IeAefUAc6EMpgVpyP1VAK4riuPnO-xwkdDrPuPImcMK7pfu0YoztCv1KmaUj6g1iu1-eHdqDdTpzsL7Ov48nQOU0at54_Kz2eu3hTNxDrsE4O0_ggsgsWK9JaIWsPtFFGPw2mqIlf8YLY_4aUjKRo5GXQ51M7h_LMaIy_bQ87qQS77yn-h7ATrQ")',
                }}
              ></div>
            </div>

            {/* Active Order Card */}
            <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      In Transit • Estimated 5:15 PM
                    </span>
                    <h3 className="text-lg font-bold">Urban Harvest Market</h3>
                  </div>
                  <span className="text-gray-400 material-symbols-outlined">
                    local_shipping
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    Order #ORD-7752:
                  </span>{" "}
                  50x Avocados, 10x Case of Kale
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleTrackVehicle("ORD-7752")}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-[#121615] dark:text-white h-11 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Track Vehicle
                  </button>
                </div>
              </div>
            </div>
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
                {/* Inventory Item Row */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Whole Milk 1L</p>
                      <p className="text-[10px] text-gray-400">SKU: MK-0012</p>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      In Stock
                    </span>
                  </div>
                  <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <button
                      onClick={() => handleStockUpdate("Whole Milk 1L", "Available")}
                      className="flex-1 py-1 text-[10px] font-bold rounded bg-white dark:bg-gray-700 shadow-sm text-primary hover:bg-gray-100 transition-colors"
                    >
                      AVL
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Whole Milk 1L", "Low Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:text-risk-amber hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      LOW
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Whole Milk 1L", "Out of Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      OUT
                    </button>
                  </div>
                </div>
                {/* Inventory Item Row */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Organic Eggs 12pk</p>
                      <p className="text-[10px] text-gray-400">SKU: EG-4491</p>
                    </div>
                    <span className="text-xs font-bold text-risk-amber">
                      Low Stock
                    </span>
                  </div>
                  <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <button
                      onClick={() => handleStockUpdate("Organic Eggs 12pk", "Available")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      AVL
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Organic Eggs 12pk", "Low Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded bg-white dark:bg-gray-700 shadow-sm text-risk-amber hover:bg-gray-100 transition-colors"
                    >
                      LOW
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Organic Eggs 12pk", "Out of Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      OUT
                    </button>
                  </div>
                </div>
                {/* Inventory Item Row */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">Salted Butter 250g</p>
                      <p className="text-[10px] text-gray-400">SKU: BT-2104</p>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      Unavailable
                    </span>
                  </div>
                  <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <button
                      onClick={() => handleStockUpdate("Salted Butter 250g", "Available")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      AVL
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Salted Butter 250g", "Low Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      LOW
                    </button>
                    <button
                      onClick={() => handleStockUpdate("Salted Butter 250g", "Out of Stock")}
                      className="flex-1 py-1 text-[10px] font-bold rounded bg-white dark:bg-gray-700 shadow-sm text-red-500 hover:bg-gray-100 transition-colors"
                    >
                      OUT
                    </button>
                  </div>
                </div>
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

