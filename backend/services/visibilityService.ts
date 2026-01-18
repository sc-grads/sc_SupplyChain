import { VisibilityStatus } from "@prisma/client";
import prisma from "../config/db.js";

export async function findEligibleSuppliers(
  orderId: string,
): Promise<string[]> {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    select: { items: true, deliveryLocation: true, partialAllowed: true },
  });

  const items = order.items as any[];
  const requiredSkuCodes = items.map((item: any) => item.sku);
  const location = order.deliveryLocation.toLowerCase();

  // Fetch all suppliers with catalog & inventory
  const suppliers = await prisma.supplierProfile.findMany({
    include: {
      catalog: { include: { sku: true } },
      inventory: true,
    },
  });

  const eligibleIds: string[] = [];

  for (const supplier of suppliers) {
    // 1. Service area match
    const areaMatch = supplier.serviceAreas.some((area) =>
      location.includes(area.toLowerCase()),
    );
    if (!areaMatch) continue;

    // 2. Catalog & inventory check for ALL items
    let allMatch = true;
    for (const reqSku of requiredSkuCodes) {
      const supplierSku = supplier.catalog.find((c) => c.sku.code === reqSku);
      if (!supplierSku) {
        allMatch = false;
        break;
      }

      const inv = supplier.inventory.find((i) => i.skuId === supplierSku.skuId);
      if (!inv || inv.status === "UNAVAILABLE") {
        allMatch = false;
        break;
      }

      if (!order.partialAllowed && inv.status !== "AVAILABLE") {
        allMatch = false;
        break;
      }
    }

    if (allMatch) eligibleIds.push(supplier.supplierId);
  }

  return eligibleIds;
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
