import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
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

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/analytics/vendor`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  // Auto-fetch on mount when token is available
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token, fetchAnalytics]);

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData,
        loading,
        error,
        fetchAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
