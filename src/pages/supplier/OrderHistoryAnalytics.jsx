import React from "react";
import Layout from "../../components/Layout";

const OrderHistoryAnalytics = () => {
  const orders = [
    {
      id: "ORD-24891",
      date: "Sept 28, 2024",
      retailer: "Apex Retail Group",
      value: "$4,250.00",
      status: "Delivered",
      leadTime: "2.1 Days",
    },
    {
      id: "ORD-24888",
      date: "Sept 27, 2024",
      retailer: "Global Goods Inc.",
      value: "$1,120.50",
      status: "Processing",
      leadTime: "--",
    },
    {
      id: "ORD-24882",
      date: "Sept 26, 2024",
      retailer: "Metro Supply Co.",
      value: "$890.00",
      status: "Delayed",
      leadTime: "5.4 Days",
    },
    {
      id: "ORD-24875",
      date: "Sept 25, 2024",
      retailer: "Apex Retail Group",
      value: "$6,400.00",
      status: "Delivered",
      leadTime: "1.8 Days",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1240px] mx-auto pb-12">
        {/* Page Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#121615] dark:text-white">
            Order History Report
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Detailed view of all past orders and fulfillment performance
          </p>
        </div>

        {/* Historical Order List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-[#121615] dark:text-white">
              Historical Orders
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  filter_alt
                </span>
                <select className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary appearance-none dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <option>Retailer: All</option>
                  <option>Apex Retail Group</option>
                  <option>Global Goods Inc.</option>
                </select>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  event
                </span>
                <select className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary appearance-none dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <option>Date: This Month</option>
                  <option>Date: Last Quarter</option>
                </select>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  check_circle
                </span>
                <select className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary appearance-none dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <option>Status: Delivered</option>
                  <option>Status: Processing</option>
                  <option>Status: Delayed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Retailer
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Lead Time
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-[#121615] dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#121615] dark:text-white">
                      {order.retailer}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-primary">
                      {order.value}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === "Delivered"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : order.status === "Processing"
                              ? "bg-[#2699D6]/10 text-[#2699D6] border border-[#2699D6]/20"
                              : "bg-[#E65C5C]/10 text-[#E65C5C] border border-[#E65C5C]/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-bold ${order.status === "Delayed" ? "text-[#E65C5C]" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {order.leadTime}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          more_horiz
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <p className="text-xs font-bold text-gray-400 tracking-wide">
              Showing 4 of 1,284 orders
            </p>
            <div className="flex gap-2">
              <button className="size-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="size-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistoryAnalytics;
