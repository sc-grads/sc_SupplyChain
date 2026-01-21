import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";
import { isOrderAtRisk } from "../../utils/orderUtils";

// Helper to get formatted supplier name
const getSupplierName = (order) => {
  const accepted = order.visibility?.find((v) => v.status === "ACCEPTED");
  return (
    accepted?.supplier?.name ||
    order.supplier ||
    (order.visibility?.length > 0
      ? order.visibility[0].supplier?.name
      : "Pending Assignment")
  );
};

// Helper function to extract unique months
const getUniqueMonths = (orders) => {
  const months = orders
    .map((order) => {
      const date = order.placedAt ? new Date(order.placedAt) : null;
      if (!date) return null;
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    })
    .filter(Boolean);
  return ["All", ...new Set(months)];
};

// Helper function to extract unique suppliers
const getUniqueSuppliers = (orders) => {
  const suppliers = orders.map((order) => getSupplierName(order));
  return ["All Suppliers", ...new Set(suppliers)];
};

// Helper to replicate backend price simulation
const getMockPrice = (sku) => {
  if (!sku) return 50;
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = sku.charCodeAt(i) + ((hash << 5) - hash);
  }
  const price = (Math.abs(hash) % 500) + 50;
  return price;
};

// Helper to format date
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
                  #{order.orderNumber || order.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {getSupplierName(order)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDisplayDate(order.placedAt || order.date)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm">
                  {order.items?.length || 0}
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm">
                  R{" "}
                  {(
                    (order.subtotal ||
                      order.items?.reduce(
                        (sum, item) =>
                          sum +
                          (item.price || getMockPrice(item.sku)) *
                            (item.quantity || 0),
                        0,
                      ) ||
                      0) * 1.08
                  ).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                        order.orderState === "PENDING"
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                          : order.orderState === "ACCEPTED"
                            ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                            : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                      }`}
                    >
                      {order.orderState || order.status}
                    </span>
                    {isOrderAtRisk(order) && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        Late
                      </span>
                    )}
                  </div>
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
  };

  const handleReorder = () => {
    alert(`Reordering items from order ${order.id}`);
  };

  const handleContactSupplier = () => {
    alert(`Contacting ${order.supplier}...`);
  };

  const calculatedSubtotal =
    order.subtotal ||
    order.items?.reduce(
      (sum, item) =>
        sum + (item.price || getMockPrice(item.sku)) * (item.quantity || 0),
      0,
    ) ||
    0;

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight">
              Order #{order.orderNumber || order.id}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                order.orderState === "PENDING"
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : order.orderState === "ACCEPTED"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              {order.orderState || order.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {getSupplierName(order)} • Placed on{" "}
            {order.placedAt
              ? new Date(order.placedAt).toLocaleDateString()
              : order.date}
          </p>
        </div>
        <div className="flex gap-3">
          {order.status === "In Transit" && (
            <button
              onClick={handleTrackDelivery}
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
            >
              <span className="material-symbols-outlined mr-2">
                location_on
              </span>
              <span>Track Delivery</span>
            </button>
          )}
          {order.status === "Delivered" && (
            <button
              onClick={handleReorder}
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-status-green text-white text-sm font-bold shadow-lg shadow-status-green/20 hover:brightness-105 transition-all"
            >
              <span className="material-symbols-outlined mr-2">refresh</span>
              <span>Reorder</span>
            </button>
          )}
          <button
            onClick={handleContactSupplier}
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <span className="material-symbols-outlined mr-2">call</span>
            <span>Contact Supplier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
              <a
                className="flex items-center border-b-[3px] border-primary text-primary pb-4 pt-5 px-1 font-bold text-sm tracking-wide"
                href="#"
              >
                Items ({order.items?.length || 0})
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
                  {order.items?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                        <span className="font-bold text-sm">
                          {item.name || "Product"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        R {(item.price || getMockPrice(item.sku)).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm">
                        R{" "}
                        {(
                          (item.price || getMockPrice(item.sku)) * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-background-light/30 dark:bg-background-dark flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>R {calculatedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                  <span>Tax (8%)</span>
                  <span>R {(calculatedSubtotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#121714] dark:text-white font-black text-xl border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span>R {(calculatedSubtotal * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NewOrderForm = ({
  onSubmit,
  onCancel,
  catalog,
  initialItem,
  initialQuantity,
}) => {
  const [formData, setFormData] = useState({
    item:
      initialItem && catalog.some((p) => p.skuName === initialItem)
        ? initialItem
        : catalog.length > 0
          ? catalog[0].skuName
          : "",
    quantity: initialQuantity || 1,
    urgency: "Normal",
    deliveryDate: "",
    deliveryLocation: "Pretoria",
    deliveryAddress: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedProduct = catalog.find((p) => p.skuName === formData.item);
    if (!selectedProduct) return;

    setIsSubmitting(true);

    // Map to backend schema
    const orderData = {
      items: [
        {
          sku: selectedProduct.skuCode,
          quantity: formData.quantity,
          name: selectedProduct.skuName,
        },
      ],
      deliveryLocation: formData.deliveryLocation,
      requiredDeliveryDate: formData.deliveryDate
        ? new Date(formData.deliveryDate).toISOString()
        : new Date().toISOString(),
      deliveryAddress: formData.deliveryAddress,
      partialAllowed: false,
    };

    try {
      await onSubmit(orderData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = catalog.find((p) => p.skuName === formData.item);
  const unitPrice = selectedProduct
    ? selectedProduct.price || getMockPrice(selectedProduct.skuCode)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-2xl mx-auto shadow-2xl">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              Procurement Request
            </h2>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mt-2 px-0.5">
              Digital Order Assignment
            </p>
          </div>
          <button
            onClick={onCancel}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Select Product Documentation
                </label>
                {selectedProduct && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    Est. R{(unitPrice * formData.quantity).toFixed(2)}
                  </span>
                )}
              </div>
              <select
                value={formData.item}
                onChange={(e) =>
                  setFormData({ ...formData, item: e.target.value })
                }
                className="w-full h-11 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                required
              >
                {catalog.map((product, idx) => (
                  <option key={idx} value={product.skuName}>
                    {product.skuName} ({product.supplierName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
                Order Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full h-11 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Priority Tier
              </label>
              <select
                value={formData.urgency}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value })
                }
                className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Normal">Normal Handling</option>
                <option value="Urgent">Urgent Delivery</option>
                <option value="Critical">Critical Fulfillment</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Fulfillment Deadline
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Destination Zone
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryLocation: e.target.value })
                }
                placeholder="e.g. Pretoria North"
                className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                Precise Street Address
              </label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryAddress: e.target.value })
                }
                placeholder="123 Industrial Park Drive"
                className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 h-11 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:brightness-105"}`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    rocket_launch
                  </span>
                  <span>Authorize Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SmallBusinessOrders = () => {
  const { orders, loading, fetchOrders, createOrder, catalog, fetchCatalog } =
    useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");

  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "new") {
      setShowForm(true);
      const itemName = params.get("item");
      if (itemName) {
        // We'll trust the form component to handle pre-selection if we pass it down
        // or we can set it in local state if we refactor NewOrderForm to accept defaults.
        // For now, let's just show the form.
      }
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCatalog();
  }, [fetchOrders, fetchCatalog]);

  const handleOrderSelection = (order) => {
    // CONDITIONAL ROUTING:
    // If order is ACCEPTED, go to the page with "Mark as Delivered" button
    // If order is PENDING, stay in this page and show inline details
    if (order.orderState === "ACCEPTED") {
      navigate(`/small-business/orders/${order.orderNumber || order.id}`);
    } else {
      setSelectedOrder(order);
    }
  };

  // Auto-select order if present in URL
  useEffect(() => {
    if (orderId && orders.length > 0) {
      const targetOrder = orders.find(
        (o) => o.id === orderId || o.orderNumber === orderId,
      );
      if (targetOrder) {
        setSelectedOrder(targetOrder);
      }
    }
  }, [orderId, orders]);

  const availableMonths = getUniqueMonths(orders);
  const availableSuppliers = getUniqueSuppliers(orders);

  const filteredOrders = orders.filter((order) => {
    const orderDate = order.placedAt ? new Date(order.placedAt) : null;
    const orderMonth = orderDate
      ? orderDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        })
      : null;

    const monthMatch = selectedMonth === "All" || orderMonth === selectedMonth;

    const accepted = order.visibility?.find((v) => v.status === "ACCEPTED");
    const supplierName = getSupplierName(order);

    const supplierMatch =
      selectedSupplier === "All Suppliers" || supplierName === selectedSupplier;

    return monthMatch && supplierMatch;
  });

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (orderData) => {
    const result = await createOrder(orderData);
    if (result.success) {
      toast.success("Order placed successfully!", {
        icon: "🚀",
        style: {
          borderRadius: "12px",
          background: "#121714",
          color: "#fff",
          fontWeight: "bold",
        },
      });
      setShowForm(false);
    } else {
      toast.error(`Failed to place order: ${result.error}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <button
            className={`text-sm font-medium transition-colors ${
              !selectedOrder && !showForm
                ? "text-[#121714] dark:text-white font-bold"
                : "text-gray-500 dark:text-gray-400 hover:text-primary"
            }`}
            onClick={() => {
              setSelectedOrder(null);
              setShowForm(false);
            }}
          >
            My Orders
          </button>
          {(selectedOrder || showForm) && (
            <>
              <span className="text-gray-500 dark:text-gray-500 text-sm">
                /
              </span>
              <span className="text-[#121714] dark:text-white text-sm font-bold">
                {showForm
                  ? "Place New Order"
                  : `Order #${selectedOrder.orderNumber || selectedOrder.id}`}
              </span>
            </>
          )}
        </nav>

        {showForm ? (
          <NewOrderForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            catalog={catalog}
            initialItem={new URLSearchParams(window.location.search).get(
              "item",
            )}
            initialQuantity={parseInt(
              new URLSearchParams(window.location.search).get("quantity"),
            )}
          />
        ) : !selectedOrder ? (
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
                  {availableSuppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleNewOrder}
                  className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
                >
                  <span className="material-symbols-outlined mr-2">add</span>
                  <span>New Order</span>
                </button>
              </div>
            </div>
            <OrderList
              orders={filteredOrders}
              onSelectOrder={handleOrderSelection}
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
