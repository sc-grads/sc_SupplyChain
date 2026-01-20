import React from "react";
import Layout from "../../components/Layout";

const SmallBusinessHistory = () => {
  const purchaseHistory = [
    {
      id: "#ORD-9921",
      supplier: "Global Fabric Co.",
      date: "Oct 12, 2023",
      value: "R4,250.00",
      stars: 5,
      status: "Delivered",
      items: "12x Cotton Blend, 5x Silk Roll",
    },
    {
      id: "#ORD-9884",
      supplier: "Standard Mfg.",
      date: "Oct 08, 2023",
      value: "R1,840.50",
      stars: 2,
      status: "Delayed",
      items: "20x Steel Brackets",
    },
    {
      id: "#ORD-9851",
      supplier: "Metro Pack",
      date: "Oct 05, 2023",
      value: "R890.00",
      stars: 4,
      status: "Delivered",
      items: "100x Shipping Boxes",
    },
    {
      id: "#ORD-9822",
      supplier: "Apex Logistics",
      date: "Oct 02, 2023",
      value: "R12,400.00",
      stars: 3.5,
      status: "Processing",
      items: "Heavy Machinery Parts",
    },
    {
      id: "#ORD-9799",
      supplier: "EcoSupplies",
      date: "Sept 28, 2023",
      value: "R2,100.00",
      stars: 5,
      status: "Delivered",
      items: "Recycled Packaging",
    },
    {
      id: "#ORD-9750",
      supplier: "Global Fabric Co.",
      date: "Sept 22, 2023",
      value: "R5,600.00",
      stars: 4.5,
      status: "Delivered",
      items: "Linen Fabric",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Purchase History Report
            </h2>
            <p className="text-[#6a8179]">
              Comprehensive log of all supply transactions and fulfillment
              ratings.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6a8179] text-xl">
                search
              </span>
              <input
                className="h-10 pl-10 pr-4 bg-white dark:bg-[#1e2227] border border-[#dde3e1] dark:border-gray-800 rounded-lg text-sm focus:ring-1 focus:ring-primary w-64"
                placeholder="Search orders..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-[#1e2227] p-4 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a8179] uppercase tracking-wider">
              Show:
            </span>
            <select className="bg-background-light dark:bg-white/5 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-1 focus:ring-primary cursor-pointer">
              <option>All Suppliers</option>
              <option>Global Fabric</option>
              <option>Standard Mfg.</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a8179] uppercase tracking-wider">
              Status:
            </span>
            <select className="bg-background-light dark:bg-white/5 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Any Status</option>
              <option>Delivered</option>
              <option>Delayed</option>
              <option>Processing</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a8179] uppercase tracking-wider">
              Period:
            </span>
            <select className="bg-background-light dark:bg-white/5 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year 2023</option>
            </select>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white dark:bg-[#1e2227] rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    ID & Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Supplier & Items
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Reliability
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-right text-[#6a8179]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e1] dark:divide-gray-800">
                {purchaseHistory.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-background-light/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{row.id}</div>
                      <div className="text-[10px] text-[#6a8179] font-medium">
                        {row.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{row.supplier}</div>
                      <div className="text-[10px] text-[#6a8179] truncate max-w-[200px]">
                        {row.items}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                          row.status === "Delivered"
                            ? "bg-[#07882e]/10 text-[#07882e]"
                            : row.status === "Delayed"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">
                      {row.value}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5 text-risk-amber border-b border-transparent group-hover:border-risk-amber/20 w-fit pb-0.5 transition-all">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-base ${s <= row.stars ? "fill-1" : ""}`}
                            style={{
                              fontVariationSettings: `'FILL' ${s <= row.stars ? 1 : 0}`,
                            }}
                          >
                            {s === Math.ceil(row.stars) && row.stars % 1 !== 0
                              ? "star_half"
                              : "star"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="bg-background-light dark:bg-white/5 p-2 rounded-lg text-[#6a8179] hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-[#dde3e1] dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs font-bold text-[#6a8179]">
              Showing 6 of 244 records
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, "...", 24].map((p, i) => (
                <button
                  key={i}
                  className={`size-8 flex items-center justify-center rounded-lg text-xs font-bold border transition-all ${p === 1 ? "bg-primary text-white border-primary" : "border-[#dde3e1] dark:border-gray-800 text-[#6a8179] hover:bg-gray-50 dark:hover:bg-white/5"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmallBusinessHistory;
