import prisma from "../config/db.js";

export async function getRecommendations(vendorId: string) {
  // 1. Get vendor's past SKUs from their orders
  const pastOrders = await prisma.order.findMany({
    where: { vendorId },
    select: { items: true },
  });

  const uniqueSkus = new Set<string>();
  pastOrders.forEach((order) => {
    if (Array.isArray(order.items)) {
      (order.items as any[]).forEach((item) => {
        if (item.sku) uniqueSkus.add(item.sku);
      });
    }
  });

  const skuList = Array.from(uniqueSkus);

  // 2. Find available inventory for these SKUs
  // If no history, we'll fetch general popular available items
  let inventoryItems: any[] = [];

  if (skuList.length > 0) {
    inventoryItems = await prisma.inventory.findMany({
      where: {
        sku: { code: { in: skuList } },
        status: { in: ["AVAILABLE", "LOW"] },
      },
      include: {
        supplier: {
          include: {
            supplier: { select: { name: true } },
          },
        },
        sku: { select: { name: true, code: true } },
      },
    });
  }

  // Fallback or Supplement: If few recommendations, add generic popular items
  if (inventoryItems.length < 5) {
    const moreItems = await prisma.inventory.findMany({
      where: {
        status: "AVAILABLE",
        // Exclude ones we already found
        NOT: {
          id: { in: inventoryItems.map((i) => i.id) },
        },
      },
      take: 10,
      include: {
        supplier: {
          include: {
            supplier: { select: { name: true } },
          },
        },
        sku: { select: { name: true, code: true } },
      },
    });
    inventoryItems = [...inventoryItems, ...moreItems];
  }

  // 3. Calculate "Demand" Score (Global Sales Volume)
  // We fetch all ACCEPTED orders to calculate popularity of SKUs
  const allOrders = await prisma.order.findMany({
    where: { orderState: "ACCEPTED" },
    select: { items: true },
  });

  // map: sku -> totalSold
  const demandMap = new Map<string, number>();
  allOrders.forEach((order) => {
    if (Array.isArray(order.items)) {
      (order.items as any[]).forEach((item) => {
        if (item.sku) {
          const current = demandMap.get(item.sku) || 0;
          demandMap.set(item.sku, current + (Number(item.quantity) || 0));
        }
      });
    }
  });

  // 4. Map to output format and Sort
  const recommendations = inventoryItems.map((inv) => ({
    sku: inv.sku.code,
    name: inv.sku.name,
    supplierName: inv.supplier?.supplier?.name || "Unknown Supplier",
    supplierId: inv.supplierId,
    price: inv.price || 0,
    totalSold: demandMap.get(inv.sku.code) || 0,
  }));

  // Sort by totalSold descending
  recommendations.sort((a, b) => b.totalSold - a.totalSold);

  // Return top 6
  return recommendations.slice(0, 6);
}
