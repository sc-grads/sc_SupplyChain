import React from "react";
import Layout from "../../components/Layout";

const SmallBusinessPerformance = () => {
  const historyData = [
    {
      id: "#ORD-9921",
      supplier: "Global Fabric Co.",
      date: "Oct 12, 2023",
      value: "R4,250.00",
      stars: 5,
    },
    {
      id: "#ORD-9884",
      supplier: "Standard Mfg.",
      date: "Oct 08, 2023",
      value: "R1,840.50",
      stars: 2,
    },
    {
      id: "#ORD-9851",
      supplier: "Metro Pack",
      date: "Oct 05, 2023",
      value: "R890.00",
      stars: 4,
    },
    {
      id: "#ORD-9822",
      supplier: "Apex Logistics",
      date: "Oct 02, 2023",
      value: "R12,400.00",
      stars: 3.5,
    },
  ];

  const suppliers = [
    {
      name: "Global Fabric",
      spend: 60,
      score: 85,
      scoreVal: "85",
      spendVal: "R12k",
    },
    {
      name: "Apex Logistics",
      spend: 75,
      score: 92,
      scoreVal: "92",
      spendVal: "R15k",
    },
    {
      name: "Standard Mfg.",
      spend: 90,
      score: 40,
      scoreVal: "40",
      spendVal: "R18k",
    },
    {
      name: "Metro Pack",
      spend: 35,
      score: 78,
      scoreVal: "78",
      spendVal: "R7k",
    },
    {
      name: "EcoSupplies",
      spend: 50,
      score: 98,
      scoreVal: "98",
      spendVal: "R10k",
    },
  ];

  const heatmap = [
    [10, 10, 40, 10, 10, 10, 10],
    [70, 90, 50, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 30],
    [10, 10, 10, 10, 10, 10, 10],
  ];

  const getHeatColor = (val) => {
    if (val === 10) return "bg-primary/10";
    if (val <= 30) return "bg-risk-amber/30";
    if (val <= 50) return "bg-risk-amber/50";
    if (val <= 70) return "bg-risk-amber/70";
    return "bg-risk-amber";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full pb-12 text-[#121615] dark:text-white">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Supply Chain Performance
            </h2>
            <p className="text-[#6a8179]">
              Monitoring resilience and vendor efficiency metrics for Q4 2023.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Spend",
              val: "R42,850.20",
              trend: "+5.2%",
              icon: "payments",
              color: "text-primary",
            },
            {
              label: "Supply Reliability %",
              val: "94.2%",
              trend: "+1.5%",
              icon: "verified",
              color: "text-primary",
            },
            {
              label: "Most Stable Supplier",
              val: "Global Fabric Co.",
              icon: "star_half",
              color: "text-primary",
            },
            {
              label: "Stockouts Avoided",
              val: "12 Events",
              tag: "Resilient",
              icon: "security",
              color: "text-risk-amber",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`material-symbols-outlined ${card.color} bg-primary/10 p-2 rounded-lg`}
                >
                  {card.icon}
                </span>
                {card.trend && (
                  <span className="text-[#07882e] text-xs font-bold bg-[#07882e]/10 px-2 py-1 rounded">
                    {card.trend}
                  </span>
                )}
                {card.tag && (
                  <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">
                    {card.tag}
                  </span>
                )}
              </div>
              <p className="text-[#6a8179] text-sm font-medium">{card.label}</p>
              <p className="text-2xl font-bold mt-1 truncate">{card.val}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Spend vs. Reliability Score</h3>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary"></span> Spend
                  (R)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-risk-amber"></span>{" "}
                  Score (1-100)
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 h-48">
              {suppliers.map((s, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full flex flex-col items-center gap-1 justify-end h-full">
                    <div
                      className="w-8 bg-risk-amber/20 rounded-t-sm relative transition-all group-hover:bg-risk-amber/30"
                      style={{ height: `${s.score}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        {s.scoreVal}
                      </div>
                    </div>
                    <div
                      className="w-8 bg-primary rounded-t-sm relative transition-all group-hover:brightness-110"
                      style={{ height: `${s.spend}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        {s.spendVal}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6a8179] font-bold text-center leading-tight">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e2227] p-6 rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Supply Disruption</h3>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#6a8179]">
                Past 4 Weeks
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {heatmap.flat().map((val, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${getHeatColor(val)} transition-all hover:scale-110 cursor-help`}
                  title={`Level: ${val}`}
                ></div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-[#6a8179] font-bold">
              {"MTWTFSS".split("").map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-dashed border-[#dde3e1] dark:border-gray-700 flex items-center gap-2 text-xs font-bold">
              <span>Risk Level:</span>
              <div className="flex gap-1">
                <div className="size-3 bg-primary/10 rounded-sm"></div>
                <div className="size-3 bg-risk-amber/30 rounded-sm"></div>
                <div className="size-3 bg-risk-amber/60 rounded-sm"></div>
                <div className="size-3 bg-risk-amber rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#1e2227] rounded-xl border border-[#dde3e1] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dde3e1] dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">Delivered Orders History</h3>
            <button className="p-2 hover:bg-background-light dark:hover:bg-white/5 rounded-lg text-[#6a8179]">
              <span className="material-symbols-outlined text-xl">
                filter_list
              </span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Delivery Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6a8179]">
                    Total Value
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
                {historyData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-background-light/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold">{row.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {row.supplier}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6a8179] font-medium">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">
                      {row.value}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5 text-risk-amber">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-lg ${s <= row.stars ? "fill-1" : ""}`}
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
                      <button className="text-[#6a8179] hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
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
          <div className="p-4 border-t border-[#dde3e1] dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#6a8179]">
            <span>Showing 4 of 128 orders</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-[#dde3e1] dark:border-gray-800 rounded hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 border border-[#dde3e1] dark:border-gray-800 rounded hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmallBusinessPerformance;
