import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useOrders } from "../../context/OrderContext";

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
                  {order.placedAt
                    ? new Date(order.placedAt).toLocaleDateString()
                    : order.date}
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm">
                  {order.items?.length || 0}
                </td>
                <td className="px-6 py-4 text-right font-bold text-sm">
                  ZAR {order.subtotal || 0}
                </td>
                <td className="px-6 py-4 text-center">
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
            <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 gap-8">
              <a
                className="flex items-center border-b-[3px] border-primary text-primary pb-4 pt-5 px-1 font-bold text-sm tracking-wide"
                href="#"
              >
                Items ({order.items?.length || 0})
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
                        ZAR {item.price || 0}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm">
                        ZAR {(item.price || 0) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const NewOrderForm = ({ onSubmit, onCancel }) => {
  const products = [
    {
      id: 1,
      name: "Organic Flour (25kg)",
      sku: "FLR-ORG-25",
      supplier: "Fresh Farm Supplies Co.",
    },
    {
      id: 2,
      name: "Olive Oil (20L)",
      sku: "OIL-OLV-20",
      supplier: "Fresh Farm Supplies Co.",
    },
    {
      id: 3,
      name: "Whole Milk (1L)",
      sku: "MLK-WHL-01",
      supplier: "Dairy Distributors Ltd",
    },
    {
      id: 4,
      name: "Salted Butter (1kg)",
      sku: "BTR-SLT-01",
      supplier: "Dairy Distributors Ltd",
    },
    {
      id: 5,
      name: "Espresso Beans (1kg)",
      sku: "CFE-ESP-01",
      supplier: "Premium Coffee Roasters",
    },
    {
      id: 6,
      name: "Colombian Blend (1kg)",
      sku: "CFE-COL-01",
      supplier: "Premium Coffee Roasters",
    },
  ];

  const [formData, setFormData] = useState({
    item: products[0].name,
    quantity: 1,
    urgency: "Normal",
    deliveryDate: "",
    deliveryLocation: "Johannesburg CBD",
    deliveryAddress: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProduct = products.find((p) => p.name === formData.item);
    // Map to backend schema
    const orderData = {
      items: [
        {
          sku: selectedProduct.sku,
          quantity: formData.quantity,
          name: selectedProduct.name,
        },
      ],
      deliveryLocation: formData.deliveryLocation,
      requiredDeliveryDate: formData.deliveryDate
        ? new Date(formData.deliveryDate).toISOString()
        : new Date().toISOString(),
      deliveryAddress: formData.deliveryAddress,
      partialAllowed: false,
    };
    onSubmit(orderData);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden max-w-2xl mx-auto shadow-xl">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#121714] dark:text-white">
            Place New Order
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
              Items to Order
            </label>
            <select
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            >
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name} ({product.supplier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
              Quantity
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                Desired Delivery Date
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                Delivery Location (City/Area)
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryLocation: e.target.value })
                }
                placeholder="e.g. Johannesburg CBD"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryAddress: e.target.value })
                }
                placeholder="123 Main St"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
              Delivery Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Gate code, specific dock number, etc."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121715] text-[#121714] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all h-24"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-12 rounded-lg border border-gray-200 dark:border-gray-700 text-[#121714] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
            >
              Submit to Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SmallBusinessOrders = () => {
  const { orders, loading, fetchOrders, createOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      alert("Order placed successfully!");
      setShowForm(false);
    } else {
      alert(`Failed to place order: ${result.error}`);
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
