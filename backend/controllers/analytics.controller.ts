import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as analyticsService from "../services/analyticsService.js";

export const getVendorAnalytics = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const vendorId = authReq.user?.id;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const analytics = await analyticsService.getVendorAnalytics(vendorId);
    res.json(analytics);
  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch analytics data",
      details: error.message,
    });
  }
};

export const getSupplierAnalytics = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const supplierId = authReq.user?.id;

    if (!supplierId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const analytics = await analyticsService.getSupplierAnalytics(supplierId);
    res.json(analytics);
  } catch (error: any) {
    console.error("Supplier analytics fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch supplier analytics data",
      details: error.message,
    });
  }
};
