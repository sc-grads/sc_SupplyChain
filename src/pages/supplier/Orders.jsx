import React, { useState } from "react";
import Layout from "../../components/Layout";

// Mock Data
const mockOrders = [
  {
    id: "ES-4029",
    customer: "Riverside Cafe",
    date: "Oct 12, 2023",
    total: "$567.00",
    status: "Confirmed",
    items: 5,
    paymentStatus: "paid",
  },
  {
    id: "ES-4030",
    customer: "Urban Barista",
    date: "Oct 13, 2023",
    total: "$1,240.50",
    status: "Processing",
    items: 12,
    paymentStatus: "pending",
  },
  {
    id: "ES-4031",
    customer: "Coastal Coffee",
    date: "Oct 14, 2023",
    total: "$325.00",
    status: "Delivered",
    items: 3,
    paymentStatus: "paid",
  },
  {
    id: "ES-4032",
    customer: "Mountain Brew",
    date: "Sep 28, 2023",
    total: "$892.00",
    status: "Delivered",
    items: 8,
    paymentStatus: "paid",
  },
  {
    id: "ES-4033",
    customer: "Downtown Deli",
    date: "Nov 5, 2023",
    total: "$445.50",
    status: "Processing",
    items: 6,
    paymentStatus: "pending",
  },
  {
    id: "ES-4034",
    customer: "Sunset Cafe",
    date: "Nov 12, 2023",
    total: "$678.00",
    status: "Confirmed",
    items: 7,
    paymentStatus: "paid",
  },
];

// Helper function to extract unique months from orders
const getUniqueMonths = (orders) => {
  const months = orders.map((order) => {
    const dateParts = order.date.split(" ");
    return `${dateParts[0]} ${dateParts[2]}`;
  });
  return ["All", ...new Set(months)];
};

const OrderList = ({ orders, onSelectOrder }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Items</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => onSelectOrder(order)}
              >
                <td className="px-6 py-4 font-bold text-sm text-[#121714] dark:text-white">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm">
                  {order.items}
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm">
                  {order.total}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                      order.status === "Confirmed"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                          : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    }`}
                  >
                    {order.status}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderDetails = ({ order }) => {
  const handleDeliveryRisk = () => {
    alert(`Marking order ${order.id} as at risk`);
    console.log(`Delivery at risk: ${order.id}`);
  };

  const handleMarkDelivered = () => {
    alert(`Marking order ${order.id} as delivered`);
    console.log(`Mark delivered: ${order.id}`);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight">
              Order #{order.id}
            </h1>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-wider">
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {order.customer} • Placed on {order.date}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeliveryRisk}
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-risk-amber text-black text-sm font-bold shadow-lg shadow-risk-amber/20 hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined mr-2">warning</span>
            <span>Delivery at Risk</span>
          </button>
          <button
            onClick={handleMarkDelivered}
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined mr-2">check_circle</span>
            <span>Mark Delivered</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 gap-8">
              <a
                className="flex items-center border-b-[3px] border-primary text-primary pb-4 pt-5 px-1 font-bold text-sm tracking-wide"
                href="#"
              >
                Items ({order.items})
              </a>
              <a
                className="flex items-center border-b-[3px] border-transparent text-gray-500 dark:text-gray-400 pb-4 pt-5 px-1 font-bold text-sm hover:text-primary transition-colors"
                href="#"
              >
                Logistics
              </a>
              <a
                className="flex items-center border-b-[3px] border-transparent text-gray-500 dark:text-gray-400 pb-4 pt-5 px-1 font-bold text-sm hover:text-primary transition-colors"
                href="#"
              >
                Documents
              </a>
            </div>
            <div className="overflow-x-auto">
              {/* Note: In a real app, items would be dynamic based on order ID */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfd-WIsXuEToguLF2jkdaz5idOwod342WfM_KRInoY4qaBwXXi1O5_6gj6O0b8zFooWVjH1nOATQDEwjBpSyESEuj5JhoK9UKWAOHUS8FxSIpE-Qub_6FgURoB07K2L_sdaAhMqoo9vzGW0Dmp1Uat7X2OBJzPyf5Fel5P34OaiLqpLGw6f5mEb0FpoRKyTWkPj4PKM-dzL3DIHD-E_53l--c2kZL5L7PmUmo8rG_lp7PTW-YMoqIuDBM1VAodYo_14lhTKxzDFcWX')",
                        }}
                      ></div>
                      <span className="font-bold text-sm">
                        Whole Bean Espresso (1kg)
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      COF-001-EB
                    </td>
                    <td className="px-6 py-4 text-center font-bold">12</td>
                    <td className="px-6 py-4 text-right text-sm">$24.00</td>
                    <td className="px-6 py-4 text-right font-bold text-sm">
                      $288.00
                    </td>
                  </tr>
                  {/* ... other items (truncated for brevity, using same items as before or could make dynamic) ... */}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-background-light/30 dark:bg-background-dark flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>$525.00</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Tax (8%)</span>
                  <span>$42.00</span>
                </div>
                <div className="flex justify-between text-[#121714] dark:text-white font-black text-xl border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span>{order.total}</span>
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
                <p className="font-bold">Oct 14, 2023 (10:00 - 14:00)</p>
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
                    {order.customer}
                    <br />
                    123 River Road, Suite 101
                    <br />
                    Port City, PC 54321
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
                  <p className="text-sm font-medium mt-1">John Doe (Manager)</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg w-full justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-sm">
                        call
                      </span>
                      +1 555-0199
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-background-light dark:bg-[#2c353d] px-3 py-2 rounded-lg w-full justify-center border border-gray-200 dark:border-gray-700">
                      <span className="material-symbols-outlined text-sm">
                        mail
                      </span>
                      Contact via Email
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
            <div className="relative space-y-8 pl-8 before:content-[''] before:absolute before:left-[11px] before:top-1 before:h-[calc(100%-12px)] before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
              <div className="relative">
                <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-4 border-white dark:border-background-dark z-10">
                  <span className="material-symbols-outlined text-xs font-bold">
                    check
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">Order Confirmed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.date} • 11:30 AM
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    Confirmed by Sales Team
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-white dark:border-background-dark z-10">
                  <span className="material-symbols-outlined text-xs font-bold">
                    shopping_cart
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">Order Placed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.date} • 10:00 AM
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    Placed via Web Portal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");

  const availableMonths = getUniqueMonths(mockOrders);

  const filteredOrders =
    selectedMonth === "All"
      ? mockOrders
      : mockOrders.filter((order) => {
          const dateParts = order.date.split(" ");
          const orderMonth = `${dateParts[0]} ${dateParts[2]}`;
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
                Order #{selectedOrder.id}
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
          <OrderDetails order={selectedOrder} />
        )}
      </div>
    </Layout>
  );
};

export default Orders;
