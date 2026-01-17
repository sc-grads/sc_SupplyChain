import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

// Mock data for new/pending orders
const mockNewOrders = [
    {
        id: "ORD-9104",
        customer: "The Healthy Hub",
        date: "Oct 14, 2023",
        time: "2 mins ago",
        total: "$890.50",
        items: 2,
        itemsList: "30x Artisan Sourdough, 10kg Salted Butter",
        status: "New",
        urgent: false,
    },
    {
        id: "ORD-9105",
        customer: "Green Grocer - Downtown",
        date: "Oct 14, 2023",
        time: "15 mins ago",
        total: "$1,245.00",
        items: 3,
        itemsList: "12x Organic Milk, 24x Eggs, 5kg Fresh Spinach",
        status: "New",
        urgent: false,
    },
    {
        id: "ORD-9103",
        customer: "Urban Harvest Market",
        date: "Oct 14, 2023",
        time: "1 hour ago",
        total: "$2,150.00",
        items: 5,
        itemsList: "50x Avocados, 10x Case of Kale, 20kg Tomatoes",
        status: "Pending",
        urgent: true,
    },
    {
        id: "ORD-9102",
        customer: "Fresh & Co",
        date: "Oct 14, 2023",
        time: "2 hours ago",
        total: "$675.00",
        items: 4,
        itemsList: "15kg Carrots, 10kg Potatoes, 5kg Onions, 3kg Garlic",
        status: "New",
        urgent: false,
    },
];

const NewOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState(mockNewOrders);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAcceptOrder = (orderId) => {
        if (window.confirm(`Accept order ${orderId}?`)) {
            alert(`Order ${orderId} has been accepted!`);
            console.log(`Accepted order: ${orderId}`);
            // Remove from list
            setOrders(orders.filter((order) => order.id !== orderId));
        }
    };

    const handleDeclineOrder = (orderId) => {
        if (window.confirm(`Are you sure you want to decline order ${orderId}? This action cannot be undone.`)) {
            alert(`Order ${orderId} has been declined.`);
            console.log(`Declined order: ${orderId}`);
            // Remove from list
            setOrders(orders.filter((order) => order.id !== orderId));
        }
    };

    const handleViewDetails = (orderId) => {
        alert(`Viewing full details for order ${orderId}`);
        console.log(`View details: ${orderId}`);
    };

    const filteredOrders = orders.filter((order) =>
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-gray-500 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            New Orders Awaiting Review
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} pending your approval
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search by customer or order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                            inbox
                        </span>
                        <h3 className="text-lg font-bold mb-2">No New Orders</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? "No orders match your search." : "All orders have been reviewed!"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className={`bg-white dark:bg-gray-900 rounded-xl border ${order.urgent
                                        ? "border-risk-amber shadow-lg shadow-risk-amber/10"
                                        : "border-gray-200 dark:border-gray-800"
                                    } overflow-hidden transition-all hover:shadow-md`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold">
                                                    Order #{order.id}
                                                </h3>
                                                {order.urgent && (
                                                    <span className="px-2 py-1 bg-risk-amber/10 text-risk-amber text-xs font-bold rounded-full border border-risk-amber/20 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">warning</span>
                                                        Urgent
                                                    </span>
                                                )}
                                                <span
                                                    className={`px-3 py-1 text-xs font-bold rounded-full border ${order.status === "New"
                                                            ? "bg-new-blue/10 text-new-blue border-new-blue/20"
                                                            : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                                <span className="font-bold text-gray-700 dark:text-gray-200">
                                                    {order.customer}
                                                </span>{" "}
                                                • {order.time}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                {order.itemsList}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {order.items} item{order.items !== 1 ? "s" : ""}
                                                </span>
                                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                                <span className="font-bold text-lg">{order.total}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                                            <button
                                                onClick={() => handleViewDetails(order.id)}
                                                className="px-4 h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDeclineOrder(order.id)}
                                                className="px-4 h-11 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleAcceptOrder(order.id)}
                                                className="px-6 h-11 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                                Accept Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bulk Actions (if needed in future) */}
                {filteredOrders.length > 0 && (
                    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                            Review each order carefully before accepting or declining.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default NewOrders;
