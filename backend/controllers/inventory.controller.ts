import { Request, Response } from "express";
import prisma from "../config/db.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const getInventory = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Find supplier profile for this user
    const profile = await prisma.supplierProfile.findUnique({
      where: { supplierId: userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Supplier profile not found." });
    }

    const inventory = await prisma.inventory.findMany({
      where: { supplierId: profile.id },
      include: { sku: true },
    });
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch inventory",
      details: error.message,
    });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { skuId, status, quantity } = req.body;

    const profile = await prisma.supplierProfile.findUnique({
      where: { supplierId: userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Supplier profile not found." });
    }

    const updated = await prisma.inventory.upsert({
      where: {
        supplierId_skuId: {
          supplierId: profile.id,
          skuId,
        },
      },
      update: { status, quantity },
      create: {
        supplierId: profile.id,
        skuId,
        status,
        quantity,
      },
    });

    res.json({ message: "Inventory updated.", inventory: updated });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update inventory",
      details: error.message,
    });
  }
};
