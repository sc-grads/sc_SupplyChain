import { Request, Response } from "express";
import prisma from "../config/db.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import * as orderService from "../services/orderService.js";

export const getInventory = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const role = authReq.user?.role;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (role === "SUPPLIER") {
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
      return res.json(inventory);
    } else {
      // VENDOR / RETAILER Logic
      let inventory = await (prisma as any).retailerInventory.findMany({
        where: { vendorId: userId },
        include: { sku: true },
      });

      // If empty, auto-seed some demo items for the prototype
      if (inventory.length === 0) {
        const skus = await prisma.sku.findMany({ take: 5 });
        if (skus.length > 0) {
          const demoItems = skus.map((sku, index) => ({
            vendorId: userId,
            skuId: sku.id,
            currentStock: index === 2 ? 0 : index === 1 ? 8 : 45,
            reorderLevel: 15,
            category: index % 2 === 0 ? "BAKING" : "DAIRY",
            unit: "units",
          }));

          for (const item of demoItems) {
            await (prisma as any).retailerInventory.upsert({
              where: {
                vendorId_skuId: { vendorId: userId, skuId: item.skuId },
              },
              update: {},
              create: item,
            });
          }

          inventory = await (prisma as any).retailerInventory.findMany({
            where: { vendorId: userId },
            include: { sku: true },
          });
        }
      }

      // Format for frontend expectation (mirroring supplier inventory structure if needed, or keeping as is)
      const formatted = inventory.map((item: any) => ({
        id: item.id,
        skuId: item.skuId,
        name: item.sku.name,
        sku: item.sku.code,
        category: item.category,
        currentStock: item.currentStock,
        reorderLevel: item.reorderLevel,
        autoReorderEnabled: item.autoReorderEnabled,
        reorderQuantity: item.reorderQuantity,
        unit: item.unit,
        lastOrdered: item.lastOrdered
          ? new Date(item.lastOrdered).toLocaleDateString()
          : "N/A",
      }));

      res.json(formatted);
    }
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
    const role = authReq.user?.role;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { skuId, status, quantity, price, reorderLevel } = req.body;

    if (quantity !== undefined && parseInt(quantity) > 1000) {
      return res
        .status(400)
        .json({ message: "Stock level cannot exceed 1000 units." });
    }

    if (role === "SUPPLIER") {
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

      const updated = await (prisma.inventory as any).upsert({
        where: {
          supplierId_skuId: {
            supplierId: profile.id,
            skuId,
          },
        },
        update: {
          status,
          quantity: quantity !== undefined ? parseInt(quantity) : undefined,
          price: price !== undefined ? parseFloat(price) : undefined,
        },
        create: {
          supplierId: profile.id,
          skuId,
          status,
          quantity: quantity !== undefined ? parseInt(quantity) : 0,
          price: price !== undefined ? parseFloat(price) : 0,
        },
      });

      return res.json({ message: "Inventory updated.", inventory: updated });
    } else {
      // VENDOR / RETAILER Update Logic
      const { autoReorderEnabled, reorderQuantity } = req.body;

      const updated = await (prisma as any).retailerInventory.update({
        where: {
          vendorId_skuId: {
            vendorId: userId,
            skuId: skuId,
          },
        },
        data: {
          currentStock: quantity !== undefined ? parseInt(quantity) : undefined,
          reorderLevel:
            reorderLevel !== undefined ? parseInt(reorderLevel) : undefined,
          autoReorderEnabled:
            autoReorderEnabled !== undefined ? autoReorderEnabled : undefined,
          reorderQuantity:
            reorderQuantity !== undefined
              ? parseInt(reorderQuantity)
              : undefined,
        },
        include: { sku: true },
      });

      // Auto-Reorder Trigger Logic
      let autoOrderResult = null;
      if (
        updated.autoReorderEnabled &&
        updated.currentStock <= updated.reorderLevel
      ) {
        try {
          // 1. Get Vendor Details for Address
          const vendor = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (vendor && vendor.address) {
            // Parse Address: "street, city" or similar
            const parts = vendor.address.split(",");
            const deliveryLocation = "Pretoria"; // Overridden to Pretoria for testing as requested by user
            const deliveryAddress =
              parts.length > 1
                ? parts
                    .slice(0, parts.length - 1)
                    .join(",")
                    .trim()
                : vendor.address;

            // 2. Create Order
            const order = await orderService.createOrder({
              vendorId: userId,
              items: [
                {
                  sku: updated.sku.code,
                  quantity: updated.reorderQuantity || 50,
                  name: updated.sku.name,
                },
              ],
              partialAllowed: false,
              deliveryLocation,
              deliveryAddress,
              requiredDeliveryDate: new Date(Date.now() + 86400000), // Tomorrow
            });

            // 3. Log Event
            await prisma.event.create({
              data: {
                type: "auto_reorder_triggered",
                userId: userId,
                orderId: order.id,
                details: {
                  sku: updated.sku.code,
                  triggerStock: updated.currentStock,
                },
              },
            });

            autoOrderResult = {
              triggered: true,
              success: true,
              message: `Auto-reorder placed for ${updated.sku.name} — ${updated.reorderQuantity || 50} units.\n📍 Delivering to: ${deliveryLocation}\n📡 Status: Broadcast to suppliers`,
              order,
            };
          } else {
            console.warn("Auto-reorder skipped: Vendor has no address.");
            autoOrderResult = {
              triggered: true,
              success: false,
              message: "Vendor has no address configured for delivery.",
            };
          }
        } catch (err: any) {
          console.error("Auto-reorder failed:", err);
          autoOrderResult = {
            triggered: true,
            success: false,
            message: err.message || "Unknown error",
          };
        }
      }

      return res.json({
        message: "Retailer inventory updated.",
        inventory: updated,
        autoReorder: autoOrderResult,
      });
    }
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

    if (
      !serviceAreas ||
      !Array.isArray(serviceAreas) ||
      serviceAreas.length === 0
    ) {
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
