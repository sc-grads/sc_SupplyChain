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

    // CRITICAL FIX: Ensure SupplierSku catalog entry exists when updating inventory
    // This is required for Targeted Order Distribution to work
    await prisma.supplierSku.upsert({
      where: {
        supplierId_skuId: {
          supplierId: profile.id,
          skuId,
        },
      },
      update: {}, // Catalog entry exists, no update needed
      create: {
        supplierId: profile.id,
        skuId,
      },
    });

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

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      include: {
        sku: true,
        supplier: {
          include: {
            supplier: {
              select: { name: true },
            },
          },
        },
      },
    });

    const formattedCatalog = inventoryItems.map((item) => ({
      skuId: item.skuId,
      skuCode: item.sku.code,
      skuName: item.sku.name,
      supplierId: item.supplierId,
      supplierName: item.supplier.supplier.name || "Unknown Supplier",
    }));

    res.json(formattedCatalog);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch global catalog from inventory",
      details: error.message,
    });
  }
};

export const updateServiceAreas = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { serviceAreas } = req.body;

    if (!serviceAreas || !Array.isArray(serviceAreas) || serviceAreas.length === 0) {
      return res.status(400).json({
        message: "serviceAreas must be a non-empty array of strings.",
      });
    }

    // Validate all are strings and filter empty values
    const validServiceAreas = serviceAreas
      .filter((area: any) => typeof area === "string" && area.trim())
      .map((area: string) => area.trim());

    if (validServiceAreas.length === 0) {
      return res.status(400).json({
        message: "At least one valid service area is required.",
      });
    }

    const profile = await prisma.supplierProfile.findUnique({
      where: { supplierId: userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Supplier profile not found." });
    }

    const updated = await prisma.supplierProfile.update({
      where: { supplierId: userId },
      data: { serviceAreas: validServiceAreas },
    });

    res.json({
      message: "Service areas updated successfully.",
      serviceAreas: updated.serviceAreas,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update service areas",
      details: error.message,
    });
  }
};
