import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const API_BASE = "http://localhost:5000/api";

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchCatalog = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/catalog`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch product catalog");
      const data = await response.json();
      setCatalog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  const fetchActiveOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders/supplier/active`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error(
          (await response.text()) || "Failed to load active orders",
        );
      }
      const data = await response.json();
      setActiveOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Active orders fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  const fetchNewRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders/new-requests`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch new requests");
      const data = await response.json();
      setNewRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create order");
      }
      const newOrder = await response.json();
      setOrders((prev) => [newOrder.order, ...prev]);
      return { success: true, order: newOrder.order };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/accept`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to accept order");
      const data = await response.json();

      // Update local state
      setNewRequests((prev) => prev.filter((o) => o.id !== orderId));
      setOrders((prev) => [data.order, ...prev]);
      await fetchActiveOrders();

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const declineOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/decline`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to decline order");

      // Update local state
      setNewRequests((prev) => prev.filter((o) => o.id !== orderId));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      const data = await response.json();

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderState: "CANCELLED" } : o,
        ),
      );
      setNewRequests((prev) => prev.filter((o) => o.id !== orderId));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, status) => {
    // status: "OUT_FOR_DELIVERY", "IN_TRANSIT", "DELIVERED"
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/orders/${orderId}/delivery-status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status }),
        },
      );
      if (!response.ok) throw new Error("Failed to update delivery status");
      const data = await response.json();

      // If delivered, update local state
      if (status === "DELIVERED") {
        setActiveOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, deliveryState: "DELIVERED" } : o,
          ),
        );
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        newRequests,
        loading,
        error,
        fetchOrders,
        fetchNewRequests,
        fetchCatalog,
        createOrder,
        cancelOrder,
        acceptOrder,
        declineOrder,
        activeOrders,
        fetchActiveOrders,
        catalog,
        updateDeliveryStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
