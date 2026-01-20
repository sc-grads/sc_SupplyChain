import React from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const PerformanceAnalytics = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-[1240px] mx-auto pb-12">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#121615] dark:text-white">
              Supplier Performance Analytics
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Quarterly performance review and logistics insights for Q3 2024
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              Last 90 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export Report
            </button>
          </div>
        </div>

        {/* Top-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-semibold">
                Total Orders Delivered
              </p>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-lg">
                local_shipping
              </span>
            </div>
            <p className="text-3xl font-extrabold mb-1">1,284</p>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>
              +12.5% vs last quarter
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm border-t-4 border-t-primary">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-semibold">
                On-Time Fulfillment %
              </p>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-lg">
                verified_user
              </span>
            </div>
            <p className="text-3xl font-extrabold mb-1">98.2%</p>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>
              +2.1% improvement
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-semibold">
                Average Lead Time
              </p>
              <span className="material-symbols-outlined text-[#2699D6] bg-[#2699D6]/10 p-1.5 rounded-lg text-lg">
                schedule
              </span>
            </div>
            <p className="text-3xl font-extrabold mb-1">3.2 Days</p>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-xs">
                trending_down
              </span>
              -0.5d (Faster)
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-semibold">
                Revenue Growth
              </p>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-lg">
                payments
              </span>
            </div>
            <p className="text-3xl font-extrabold mb-1">$42,500</p>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>
              +8.0% growth
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Large Line Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">
                  Orders Completed vs. Delayed
                </h3>
                <p className="text-sm text-gray-400">
                  Trend analysis for the last 30 days
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-primary"></span>
                  <span className="text-xs font-semibold text-gray-500">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#2699D6]"></span>
                  <span className="text-xs font-semibold text-gray-500">
                    Delayed
                  </span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full relative">
              {/* Simulated Chart SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 240">
                {/* Background Grid */}
                <line
                  stroke="#f0f0f0"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="40"
                  y2="40"
                  className="stroke-gray-100 dark:stroke-gray-800"
                ></line>
                <line
                  stroke="#f0f0f0"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="100"
                  y2="100"
                  className="stroke-gray-100 dark:stroke-gray-800"
                ></line>
                <line
                  stroke="#f0f0f0"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="160"
                  y2="160"
                  className="stroke-gray-100 dark:stroke-gray-800"
                ></line>
                <line
                  stroke="#f0f0f0"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="220"
                  y2="220"
                  className="stroke-gray-100 dark:stroke-gray-800"
                ></line>
                {/* Completed Orders Line */}
                <path
                  d="M0,200 Q100,180 200,80 T400,120 T600,40 T800,90"
                  fill="none"
                  stroke="#339977"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
                {/* Delayed Orders Line */}
                <path
                  d="M0,220 Q150,230 300,210 T500,225 T800,215"
                  fill="none"
                  stroke="#2699D6"
                  strokeDasharray="8,4"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-[10px] font-bold text-gray-400">
                  Sept 01
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  Sept 10
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  Sept 20
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  Sept 30
                </span>
              </div>
            </div>
          </div>

          {/* Reliability Leaderboard */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold mb-1">Reliability Leaderboard</h3>
            <p className="text-sm text-gray-400 mb-6">
              Top performing retailers
            </p>
            <div className="space-y-5">
              {[
                { name: "Apex Retail Group", score: "99.8%", val: 99, rank: 1 },
                { name: "Global Goods Inc.", score: "97.4%", val: 97, rank: 2 },
                { name: "Metro Supply Co.", score: "95.1%", val: 95, rank: 3 },
                { name: "Pioneer Logistics", score: "92.8%", val: 92, rank: 4 },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-4">
                  <div
                    className={`size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-bold ${item.rank === 1 ? "text-primary" : "text-gray-500"}`}
                  >
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold">{item.name}</span>
                      <span className="text-xs font-bold text-primary">
                        {item.score}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/analytics/history")}
              className="w-full mt-6 py-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors border border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
            >
              View Full Rankings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceAnalytics;
