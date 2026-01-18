import { Request, Response } from "express";
import * as orderService from "../services/orderService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import prisma from "../config/db.js";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const vendorId = authReq.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getOrdersByVendor(vendorId);
    res.json(orders);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", details: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const vendorId = authReq.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const {
      items,
      partialAllowed,
      deliveryLocation,
      requiredDeliveryDate,
      deliveryAddress,
    } = req.body;

    // Validate (simple for prototype)
    if (!items?.length || !deliveryLocation || !requiredDeliveryDate) {
      return res
        .status(400)
        .json({ message: "Missing required fields: items, location, date." });
    }

    // CRITICAL FIX: Validate SKU codes exist in database
    // This prevents orders with invalid SKUs from being created
    const skuCodes = items.map((item: any) => item.sku).filter(Boolean);

    if (skuCodes.length === 0) {
      return res.status(400).json({
        message: "Invalid order: all items must have valid SKU codes.",
      });
    }

    const existingSkus = await prisma.sku.findMany({
      where: { code: { in: skuCodes } },
      select: { code: true },
    });

    const existingSkuCodes = new Set(existingSkus.map((s) => s.code));
    const missingSkus = skuCodes.filter(
      (code: string) => !existingSkuCodes.has(code),
    );

    if (missingSkus.length > 0) {
      return res.status(400).json({
        message: `Invalid SKU codes: ${missingSkus.join(", ")}. Please use valid SKU codes from the catalog.`,
        invalidSkus: missingSkus,
      });
    }

    // Create order
    const order = await orderService.createOrder({
      vendorId,
      items, // [{sku: "M8-BOLT-20", quantity: 500, ...}]
      partialAllowed,
      deliveryLocation,
      requiredDeliveryDate: new Date(requiredDeliveryDate),
      deliveryAddress,
    });

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to place order. Please try again.",
      details: error.message,
    }); // Graceful error
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Valid Order ID is required." });
    }

    const order = await orderService.cancelOrder(id);
    res.json({ message: "Order cancelled successfully.", order });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to cancel order.",
      details: error.message,
    });
  }
};

export const getNewRequests = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const supplierId = authReq.user?.id;
    if (!supplierId) return res.status(401).json({ message: "Unauthorized" });

    const requests = await orderService.getNewRequests(supplierId);
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch new requests.",
      details: error.message,
    });
  }
};

export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const supplierId = authReq.user?.id;
    if (!supplierId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const order = await orderService.acceptOrder(id as string, supplierId);
    res.json({ message: "Order accepted successfully.", order });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to accept order.",
      details: error.message,
    });
  }
};

export const declineOrder = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const supplierId = authReq.user?.id;
    if (!supplierId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    await orderService.declineOrder(id as string, supplierId);
    res.json({ message: "Order declined." });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to decline order.",
      details: error.message,
    });
  }
};

export const getSupplierActiveOrders = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const supplierId = authReq.user?.id;
    if (!supplierId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getActiveOrdersForSupplier(supplierId);

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to load your active orders. Please refresh.",
      details: error.message,
    });
  }
};
