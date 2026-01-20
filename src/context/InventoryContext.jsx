import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const API_BASE = "http://localhost:5000/api";

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchInventory = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  const updateStock = async (skuId, quantity, status, price) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ skuId, quantity, status, price }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.details ||
            "Failed to update inventory",
        );
      }

      // Refresh inventory after update
      await fetchInventory();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        loading,
        error,
        fetchInventory,
        updateStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
