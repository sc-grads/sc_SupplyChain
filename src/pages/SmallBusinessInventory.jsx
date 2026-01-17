import React, { useState } from "react";
import Layout from "../components/Layout";

const SmallBusinessInventory = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Layout>
            <div className="max-w-[1400px] mx-auto w-full">
                {/* Page Heading & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                            My Inventory
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                            Track your store inventory and reorder supplies
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#111418] dark:text-white hover:bg-gray-50 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-sm">
                                cloud_download
                            </span>
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 h-10 bg-primary text-white rounded-lg text-sm font-bold hover:brightness-105 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            search
                        </span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                            placeholder="Search products..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold cursor-pointer">
                        All Items{" "}
                        <span className="bg-white/20 px-1.5 rounded text-[10px]">
                            24
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
                        Low Stock{" "}
                        <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 rounded text-[10px]">
                            3
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
                        Out of Stock{" "}
                        <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 rounded text-[10px]">
                            1
                        </span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">
                            filter_list
                        </span>
                        Category
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Current Stock
                                    </th>
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Reorder Level
                                    </th>
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                        Last Ordered
                                    </th>
                                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {/* Row 1: Good Stock */}
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
                                                    SKU: FLR-ORG-001
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                            BAKING
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-black">
                                                    45{" "}
                                                    <span className="text-gray-400 font-normal">
                                                        bags
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-status-green"
                                                    style={{ width: "90%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-500">
                                            10 bags
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">Oct 12, 2023</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 h-8 rounded bg-primary text-white text-xs font-bold hover:brightness-105 transition-all">
                                                Reorder
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 2: Low Stock */}
                                <tr className="hover:bg-primary/5 transition-colors group bg-amber-50/20 dark:bg-amber-950/5">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-amber-400/40">
                                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800"></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                                                        Whole Milk 1L
                                                    </p>
                                                    <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                </div>
                                                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                                                    SKU: MLK-WHL-012
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                            DAIRY
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-black text-amber-600">
                                                    15{" "}
                                                    <span className="text-gray-400 font-normal">
                                                        units
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-status-amber"
                                                    style={{ width: "25%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-500">
                                            20 units
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">Oct 10, 2023</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 h-8 rounded bg-amber-500 text-white text-xs font-bold hover:brightness-105 transition-all">
                                                Reorder
                                            </button>
                                        </div>
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
                                                    SKU: HNY-RAW-098
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                            SWEETENERS
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-black text-red-600">
                                                    0{" "}
                                                    <span className="text-gray-400 font-normal">
                                                        jars
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
                                        <span className="text-sm font-medium text-gray-500">
                                            5 jars
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">Sep 28, 2023</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 h-8 rounded bg-red-500 text-white text-xs font-bold hover:brightness-105 transition-all">
                                                Order Now
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 4: Good Stock */}
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                                                    Olive Oil 20L
                                                </p>
                                                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                                                    SKU: OIL-OLV-045
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                            OILS
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-black">
                                                    32{" "}
                                                    <span className="text-gray-400 font-normal">
                                                        bottles
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-status-green"
                                                    style={{ width: "80%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-500">
                                            10 bottles
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">Oct 11, 2023</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 h-8 rounded bg-primary text-white text-xs font-bold hover:brightness-105 transition-all">
                                                Reorder
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 5: Low Stock */}
                                <tr className="hover:bg-primary/5 transition-colors group bg-amber-50/20 dark:bg-amber-950/5">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-amber-400/40">
                                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800"></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">
                                                        Espresso Beans 1kg
                                                    </p>
                                                    <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                </div>
                                                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                                                    SKU: COF-ESP-024
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                            COFFEE
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-sm font-black text-amber-600">
                                                    8{" "}
                                                    <span className="text-gray-400 font-normal">
                                                        bags
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-status-amber"
                                                    style={{ width: "20%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-500">
                                            15 bags
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">Oct 11, 2023</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="inline-flex items-center justify-center size-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 h-8 rounded bg-amber-500 text-white text-xs font-bold hover:brightness-105 transition-all">
                                                Reorder
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium italic">
                            Showing 1-5 of 24 items
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
                            <button className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-800">
                                <span className="material-symbols-outlined text-lg">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-lg">info</span>
                            <h3 className="text-sm font-bold">Reorder Suggestions</h3>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Based on your usage patterns, we recommend reordering <b>Whole Milk</b> and <b>Espresso Beans</b> within the next 3 days to avoid stockouts.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-status-green/20 bg-status-green/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-status-green">
                            <span className="material-symbols-outlined text-lg">
                                trending_up
                            </span>
                            <h3 className="text-sm font-bold">Inventory Health</h3>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Your inventory is <b>83% healthy</b>. Most items are well-stocked. Focus on restocking the 4 items below reorder levels.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SmallBusinessInventory;
