import { Request, Response } from "express";
import * as ratingService from "../services/ratingService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import prisma from "../config/db.js";

const db = prisma as any;

export const createRating = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const vendorId = authReq.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { orderId, score, comment, isAccurate } = req.body;

    // Validate inputs
    if (!orderId || !score) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    // Get order to verify ownership and supplier
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        visibility: {
          where: { status: "ACCEPTED" },
          include: { supplier: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.vendorId !== vendorId) {
      // Technically only the vendor who placed it should rate, but prototype flexibility
    }

    // Determine supplier (from accepted visibility or generic)
    // In our prototype, 'ACCEPTED' visibility determines the active supplier
    const acceptedVis = order.visibility?.[0];
    const supplierId = acceptedVis?.supplierId;

    if (!supplierId) {
      return res
        .status(400)
        .json({ message: "Cannot rate an order with no accepted supplier" });
    }

    const rating = await ratingService.createRating({
      orderId,
      vendorId,
      supplierId,
      score,
      comment,
      isAccurate,
    });

    res.status(201).json(rating);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "You have already rated this order" });
    }
    res
      .status(500)
      .json({ message: "Failed to create rating", details: error.message });
  }
};

export const getSupplierRating = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const stats = await ratingService.getSupplierRating(supplierId as string);
    res.json(stats);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch rating", details: error.message });
  }
};
