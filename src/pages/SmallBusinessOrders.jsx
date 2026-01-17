import React, { useState } from "react";
import Layout from "../components/Layout";

// Mock Data
const mockOrders = [
    {
        id: "ORD-4525",
        supplier: "Dairy Distributors Ltd",
        date: "Oct 14, 2023",
        total: "$890.00",
        status: "Pending",
        items: 8,
        eta: "Awaiting confirmation",
    },
    {
        id: "ORD-4521",
        supplier: "Fresh Farm Supplies Co.",
        date: "Oct 12, 2023",
        total: "$1,240.50",
        status: "In Transit",
        items: 12,
        eta: "Oct 14, 2:00 PM",
    },
    {
        id: "ORD-4518",
        supplier: "Premium Coffee Roasters",
        date: "Oct 11, 2023",
        total: "$625.00",
        status: "In Transit",
        items: 5,
        eta: "Oct 15, 10:00 AM",
    },
    {
        id: "ORD-4512",
        supplier: "Fresh Farm Supplies Co.",
        date: "Oct 8, 2023",
        total: "$1,150.00",
        status: "Delivered",
        items: 15,
        eta: "Delivered Oct 10",
    },
    {
        id: "ORD-4505",
        supplier: "Bakery Ingredients Inc",
        date: "Sep 28, 2023",
        total: "$780.00",
        status: "Delivered",
        items: 10,
        eta: "Delivered Sep 30",
    },
    {
        id: "ORD-4498",
        supplier: "Premium Coffee Roasters",
        date: "Sep 25, 2023",
        total: "$625.00",
        status: "Delivered",
        items: 5,
        eta: "Delivered Sep 27",
    },
];

// Helper function to extract unique months
const getUniqueMonths = (orders) => {
    const months = orders.map((order) => {
        const dateParts = order.date.split(" ");
        return `${dateParts[0]} ${dateParts[2]}`;
    });
    return ["All", ...new Set(months)];
};

// Helper function to extract unique suppliers
const getUniqueSuppliers = (orders) => {
    const suppliers = orders.map((order) => order.supplier);
    return ["All Suppliers", ...new Set(suppliers)];
};

const OrderList = ({ orders, onSelectOrder }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Supplier</th>
                            <th className="px-6 py-4">Date Placed</th>
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
                                    {order.supplier}
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
                                        className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${order.status === "Pending"
                                            ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                            : order.status === "In Transit"
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
    const handleTrackDelivery = () => {
        alert(`Tracking delivery for order ${order.id}`);
        console.log(`Track delivery: ${order.id}`);
    };

    const handleReorder = () => {
        alert(`Reordering items from order ${order.id}`);
        console.log(`Reorder: ${order.id}`);
    };

    const handleContactSupplier = () => {
        alert(`Contacting ${order.supplier}...`);
        console.log(`Contact supplier: ${order.supplier}`);
    };

    const handleCall = () => {
        alert(`Calling +1 555-0123...`);
        console.log(`Call supplier contact`);
    };

    const handleEmail = () => {
        alert(`Opening email to ${order.supplier}...`);
        console.log(`Email supplier`);
    };

    return (
        <>
            <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight">
                            Order #{order.id}
                        </h1>
                        <span
                            className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${order.status === "Pending"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : order.status === "In Transit"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : "bg-green-100 text-green-700 border-green-200"
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {order.supplier} • Placed on {order.date}
                    </p>
                </div>
                <div className="flex gap-3">
                    {order.status === "In Transit" && (
                        <button onClick={handleTrackDelivery} className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all">
                            <span className="material-symbols-outlined mr-2">location_on</span>
                            <span>Track Delivery</span>
                        </button>
                    )}
                    {order.status === "Delivered" && (
                        <button onClick={handleReorder} className="flex items-center justify-center rounded-lg h-12 px-6 bg-status-green text-white text-sm font-bold shadow-lg shadow-status-green/20 hover:brightness-105 transition-all">
                            <span className="material-symbols-outlined mr-2">refresh</span>
                            <span>Reorder</span>
                        </button>
                    )}
                    <button onClick={handleContactSupplier} className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <span className="material-symbols-outlined mr-2">call</span>
                        <span>Contact Supplier</span>
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
                                Delivery Info
                            </a>
                        </div>
                        <div className="overflow-x-auto">
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
                                            <div className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                                            <span className="font-bold text-sm">
                                                Organic Flour (25kg)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            FLR-ORG-001
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold">50</td>
                                        <td className="px-6 py-4 text-right text-sm">$18.00</td>
                                        <td className="px-6 py-4 text-right font-bold text-sm">
                                            $900.00
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-100 to-amber-200"></div>
                                            <span className="font-bold text-sm">
                                                Olive Oil (20L)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            OIL-OLV-045
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold">20</td>
                                        <td className="px-6 py-4 text-right text-sm">$12.50</td>
                                        <td className="px-6 py-4 text-right font-bold text-sm">
                                            $250.00
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-background-light/30 dark:bg-background-dark flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>$1,150.00</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                                    <span>Delivery Fee</span>
                                    <span>$50.00</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                                    <span>Tax (8%)</span>
                                    <span>$40.50</span>
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
                                <span className="material-symbols-outlined">local_shipping</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                                    Delivery ETA
                                </p>
                                <p className="font-bold">{order.eta}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                                    Payment Status
                                </p>
                                <p className="font-bold">Paid</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                            Supplier Info
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-gray-500">
                                    store
                                </span>
                                <div>
                                    <p className="text-sm font-bold">Supplier Name</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                                        {order.supplier}
                                    </p>
                                </div>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-gray-500">
                                    person
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Contact Person</p>
                                    <p className="text-sm font-medium mt-1">Sarah Johnson</p>
                                    <div className="mt-3 flex flex-col gap-2">
                                        <button onClick={handleCall} className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg w-full justify-center border border-primary/20 hover:bg-primary/20 transition-colors">
                                            <span className="material-symbols-outlined text-sm">
                                                call
                                            </span>
                                            +1 555-0123
                                        </button>
                                        <button onClick={handleEmail} className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-background-light dark:bg-[#2c353d] px-3 py-2 rounded-lg w-full justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <span className="material-symbols-outlined text-sm">
                                                mail
                                            </span>
                                            Send Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">
                            Order Timeline
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
                                        {order.date} • 10:30 AM
                                    </p>
                                    <p className="text-xs mt-1 text-gray-500">
                                        Confirmed by {order.supplier}
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
                                        {order.date} • 9:00 AM
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

const SmallBusinessOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");

    const availableMonths = getUniqueMonths(mockOrders);
    const availableSuppliers = getUniqueSuppliers(mockOrders);

    const filteredOrders = mockOrders.filter((order) => {
        const dateParts = order.date.split(" ");
        const orderMonth = `${dateParts[0]} ${dateParts[2]}`;
        const monthMatch = selectedMonth === "All" || orderMonth === selectedMonth;
        const supplierMatch =
            selectedSupplier === "All Suppliers" ||
            order.supplier === selectedSupplier;
        return monthMatch && supplierMatch;
    });

    const handleNewOrder = () => {
        alert("Opening new order form...");
        console.log("New order clicked");
    };

    return (
        <Layout>
            <div className="max-w-[1280px] mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6">
                    <button
                        className={`text-sm font-medium transition-colors ${selectedOrder
                            ? "text-gray-500 dark:text-gray-400 hover:text-primary"
                            : "text-[#121714] dark:text-white font-bold"
                            }`}
                        onClick={() => setSelectedOrder(null)}
                    >
                        My Orders
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
                                    My Orders
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    Track and manage your orders from suppliers
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                    Filter by:
                                </label>
                                <select
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                >
                                    {availableSuppliers.map((supplier) => (
                                        <option key={supplier} value={supplier}>
                                            {supplier}
                                        </option>
                                    ))}
                                </select>
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
                                <button onClick={handleNewOrder} className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all">
                                    <span className="material-symbols-outlined mr-2">add</span>
                                    <span>New Order</span>
                                </button>
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

export default SmallBusinessOrders;
