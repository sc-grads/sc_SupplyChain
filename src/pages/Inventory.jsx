import React from "react";
import Layout from "../components/Layout";

const Inventory = () => {
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Page Heading & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
              Supplier Inventory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Real-time stock control for Warehouse Section B-14
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#111418] dark:text-white hover:bg-gray-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sm">
                cloud_download
              </span>
              Export Manifest
            </button>
            <button className="flex items-center gap-2 px-4 h-10 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sm">warning</span>
              Manual Override
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold cursor-pointer">
            All SKUs{" "}
            <span className="bg-white/20 px-1.5 rounded text-[10px]">
              1,284
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
            Low Stock{" "}
            <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 rounded text-[10px]">
              12
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
            Out of Stock{" "}
            <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 rounded text-[10px]">
              4
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
            At Risk{" "}
            <span className="bg-primary/10 text-primary px-1.5 rounded text-[10px]">
              8
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            More Filters
          </div>
        </div>

        {/* High Density SKU Table */}
        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Product / SKU
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Stock Level
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Status Toggle
                  </th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {/* Row 1: Available */}
                <tr className="hover:bg-primary/5 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                          Organic Flour 25kg
                        </p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: DRY-FLR-ORG-001
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      DRY GOODS
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black">
                          480{" "}
                          <span className="text-gray-400 font-normal">
                            / 500
                          </span>
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: "96%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all bg-status-green text-white border-status-green">
                        AVAILABLE
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        LOW
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        OOS
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-lg">
                        edit_note
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 2: Low Stock */}
                <tr className="hover:bg-primary/5 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                          Whole Grain Oats
                        </p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: DRY-OAT-WHL-042
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      DRY GOODS
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black">
                          15{" "}
                          <span class="text-gray-400 font-normal">/ 100</span>
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-status-amber"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        AVAILABLE
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all bg-status-amber text-white border-status-amber shadow-sm">
                        LOW
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        OOS
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-lg">
                        edit_note
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 3: Out of Stock */}
                <tr className="hover:bg-primary/5 transition-colors group bg-red-50/20 dark:bg-red-950/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden grayscale">
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                          Raw Honey 5kg
                        </p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: CND-HNY-RAW-098
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      CONDIMENTS
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black text-red-600">
                          0{" "}
                          <span className="text-gray-400 font-normal">
                            / 50
                          </span>
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-status-red"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        AVAILABLE
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        LOW
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all bg-status-red text-white border-status-red shadow-sm">
                        OOS
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-lg">
                        edit_note
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 4: At Risk */}
                <tr className="hover:bg-primary/5 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-primary/40">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                            Baking Powder
                          </p>
                          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        </div>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: ADD-BAK-PWD-003
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      ADDITIVES
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black">
                          45{" "}
                          <span className="text-gray-400 font-normal">
                            / 100
                          </span>
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all bg-status-green text-white border-status-green shadow-sm">
                        AVAILABLE
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        LOW
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        OOS
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-lg">
                        edit_note
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 5: Salt */}
                <tr className="hover:bg-primary/5 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                          Sea Salt Fine
                        </p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: SSN-SLT-FNE-012
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                      SEASONING
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-black">
                          95{" "}
                          <span className="text-gray-400 font-normal">
                            / 100
                          </span>
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all bg-status-green text-white border-status-green shadow-sm">
                        AVAILABLE
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        LOW
                      </button>
                      <button className="px-3 py-1 text-[10px] font-black rounded-md transition-all text-gray-500 hover:text-gray-700">
                        OOS
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-lg">
                        edit_note
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination/Footer Density */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium italic">
              Showing 1-15 of 1,284 SKUs
            </p>
            <div className="flex gap-1">
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary font-bold text-xs">
                1
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 text-xs">
                2
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 text-xs">
                3
              </button>
              <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Edit Overlay Simulation (Hidden normally, here for design representation) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-lg">info</span>
              <h3 className="text-sm font-bold">Quick Adjustment Note</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Use the <b>Quick Edit</b> button on any row to instantly modify
              physical inventory counts. These changes are logged and
              synchronized with active order allocations immediately.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-red-100 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 col-span-2">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-2">
              <span className="material-symbols-outlined text-xl">report</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Safety Warning: Manual Override
              </h3>
            </div>
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed mb-3">
              Manual overrides bypass algorithmic stock safeguards. Only use
              this if the physical count in the warehouse is verified by a floor
              supervisor. This action will trigger a permanent log entry in the
              compliance report.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-red-200 dark:bg-red-900/50 rounded-full">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-red-600">
                CRITICAL ACTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
