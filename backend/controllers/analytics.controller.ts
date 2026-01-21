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
