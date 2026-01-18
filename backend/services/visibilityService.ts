import { VisibilityStatus } from "@prisma/client";
import prisma from "../config/db.js";

/**
 * Normalizes an address string for comparison:
 * - UPPERCASE
 * - Remove punctuation
 * - Trim whitespace
 */
function normalizeAddress(addr: string): string {
  return addr
    .toUpperCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findEligibleSuppliers(orderId: string): Promise<{
  eligibleSuppliers: string[];
  rejectedSuppliers: { supplierId: string; reasons: string[] }[];
}> {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    select: { items: true, deliveryLocation: true, partialAllowed: true },
  });

  const orderItems = order.items as any[];
  const requiredSkus = orderItems.map((item: any) => ({
    code: item.sku,
    quantity: item.quantity,
  }));
  const normalizedOrderLocation = normalizeAddress(order.deliveryLocation);

  // Fetch all suppliers with full catalog and inventory
  const suppliers = await prisma.supplierProfile.findMany({
    include: {
      catalog: { include: { sku: true } },
      inventory: { include: { sku: true } },
    },
  });

  const eligibleSuppliers: string[] = [];
  const rejectedSuppliers: { supplierId: string; reasons: string[] }[] = [];

  for (const supplier of suppliers) {
    const reasons: string[] = [];

    // Rule 1: Address-based service matching (containment check)
    const isServiceMatch = supplier.serviceAreas.some((area) => {
      const normalizedArea = normalizeAddress(area);
      return (
        normalizedOrderLocation.includes(normalizedArea) ||
        normalizedArea.includes(normalizedOrderLocation)
      );
    });

    if (!isServiceMatch) {
      reasons.push(
        `Service area mismatch (order: ${order.deliveryLocation}, supplier areas: ${supplier.serviceAreas.join(", ")})`,
      );
      // Collector logic: continue evaluating other rules for this supplier
    }

    // Rule 2 & 3: SKU Eligibility & Inventory Enforcement
    for (const item of requiredSkus) {
      // Catalog Check
      const catalogItem = supplier.catalog.find(
        (c) => c.sku.code === item.code,
      );
      if (!catalogItem) {
        reasons.push(`SKU ${item.code} not in supplier catalog`);
        continue; // Skip inventory check for this missing SKU
      }

      // Inventory Check
      const inv = supplier.inventory.find((i) => i.sku.code === item.code);
      if (!inv || inv.status === "UNAVAILABLE") {
        reasons.push(`SKU ${item.code} inventory UNAVAILABLE`);
      } else if (inv.status === "LOW" && !order.partialAllowed) {
        reasons.push(
          `SKU ${item.code} status is LOW but partial orders not allowed`,
        );
      }
    }

    if (reasons.length === 0) {
      eligibleSuppliers.push(supplier.supplierId);
    } else {
      rejectedSuppliers.push({
        supplierId: supplier.supplierId,
        reasons,
      });
    }
  }

  // Enhanced logging for empty matches
  if (eligibleSuppliers.length === 0) {
    console.log(
      `[Targeted Order Distribution] Order ${orderId}: No eligible suppliers found.`,
    );
    console.log(
      `  Required SKUs: ${requiredSkus.map((s) => s.code).join(", ")}`,
    );
    console.log(`  Delivery location: ${order.deliveryLocation}`);
    console.log(`  Partial allowed: ${order.partialAllowed}`);
    console.log(`  Suppliers checked: ${suppliers.length}`);
    console.log(
      `  Rejected Suppliers:`,
      JSON.stringify(rejectedSuppliers, null, 2),
    );
  }

  return { eligibleSuppliers, rejectedSuppliers };
}

export async function createOrderVisibility(
  orderId: string,
  supplierIds: string[],
) {
  const visibilityData = supplierIds.map((id) => ({
    orderId,
    supplierId: id,
    status: VisibilityStatus.VISIBLE,
  }));

  await prisma.orderVisibility.createMany({ data: visibilityData });
}
