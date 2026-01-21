import prisma from "../config/db.js";

interface SupplierPerformance {
  name: string;
  spend: number;
  spendPercent: number;
  score: number;
  scoreVal: string;
  spendVal: string;
}

interface DeliveredOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  date: string;
  value: string;
  stars: number;
}

interface VendorAnalytics {
  totalSpend: number;
  totalSpendFormatted: string;
  reliabilityPercentage: number;
  mostStableSupplier: {
    name: string;
    rating: number;
  };
  stockoutsAvoided: number;
  supplierPerformance: SupplierPerformance[];
  disruptionHeatmap: number[][];
  deliveredOrders: DeliveredOrder[];
  trends: {
    spendTrend: string;
    reliabilityTrend: string;
  };
}

export interface SupplierAnalytics {
  deliveredOrders: {
    id: string;
    orderNumber: string;
    retailer: string;
    date: string;
    value: string;
    leadTime: string;
    stars: number;
    placedAt: Date;
  }[];
}

export async function getVendorAnalytics(
  vendorId: string,
): Promise<VendorAnalytics> {
  // Fetch all orders for this vendor
  const allOrders = await prisma.order.findMany({
    where: { vendorId },
    include: {
      rating: true,
      events: {
        orderBy: { timestamp: "asc" },
      },
      visibility: {
        include: {
          supplier: {
            select: { name: true, id: true },
          },
        },
      },
    },
  });

  // Filter delivered orders
  const deliveredOrders = allOrders.filter(
    (o) => o.deliveryState === "DELIVERED",
  );

  // Calculate Total Spend (including 8% tax)
  const totalSpend = deliveredOrders.reduce((sum, order) => {
    const orderSubtotal =
      order.subtotal ||
      (order.items as any[]).reduce(
        (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 0),
        0,
      );
    return sum + orderSubtotal * 1.08;
  }, 0);

  // Calculate Supply Reliability %
  // Orders that went from ON_TRACK to DELIVERED without ever being AT_RISK
  const reliableOrders = deliveredOrders.filter((order) => {
    const hasAtRiskEvent = order.events.some((e) => e.type.includes("AT_RISK"));
    return !hasAtRiskEvent;
  });
  const reliabilityPercentage =
    deliveredOrders.length > 0
      ? Math.round((reliableOrders.length / deliveredOrders.length) * 100)
      : 0;

  // Calculate Stockouts Avoided
  // Orders that were AT_RISK but still delivered
  const stockoutsAvoided = deliveredOrders.filter((order) => {
    const hasAtRiskEvent = order.events.some(
      (e) => e.type === "delay_reported" || e.type.includes("AT_RISK"),
    );
    return hasAtRiskEvent;
  }).length;

  // Find Most Stable Supplier (highest average rating)
  const supplierRatings = new Map<
    string,
    { name: string; totalScore: number; count: number }
  >();

  deliveredOrders.forEach((order) => {
    const acceptedVisibility = order.visibility.find(
      (v) => v.status === "ACCEPTED",
    );
    if (acceptedVisibility && order.rating) {
      const supplierId = acceptedVisibility.supplierId;
      const supplierName = acceptedVisibility.supplier.name || "Unknown";

      if (!supplierRatings.has(supplierId)) {
        supplierRatings.set(supplierId, {
          name: supplierName,
          totalScore: 0,
          count: 0,
        });
      }

      const data = supplierRatings.get(supplierId)!;
      data.totalScore += order.rating.score;
      data.count += 1;
    }
  });

  let mostStableSupplier = { name: "N/A", rating: 0 };
  let highestAvg = 0;

  supplierRatings.forEach((data) => {
    const avg = data.totalScore / data.count;
    if (avg > highestAvg) {
      highestAvg = avg;
      mostStableSupplier = { name: data.name, rating: avg };
    }
  });

  // Calculate Spend vs Reliability per Supplier
  const supplierSpend = new Map<
    string,
    { name: string; spend: number; scores: number[] }
  >();

  deliveredOrders.forEach((order) => {
    const acceptedVisibility = order.visibility.find(
      (v) => v.status === "ACCEPTED",
    );
    if (acceptedVisibility) {
      const supplierId = acceptedVisibility.supplierId;
      const supplierName = acceptedVisibility.supplier.name || "Unknown";
      const orderTotalWithTax =
        (order.subtotal ||
          (order.items as any[]).reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0,
          )) * 1.08;

      if (!supplierSpend.has(supplierId)) {
        supplierSpend.set(supplierId, {
          name: supplierName,
          spend: 0,
          scores: [],
        });
      }

      const data = supplierSpend.get(supplierId)!;
      data.spend += orderTotalWithTax;
      if (order.rating) {
        data.scores.push(order.rating.score);
      }
    }
  });

  // Convert to array and calculate percentages
  const maxSpend = Math.max(
    ...Array.from(supplierSpend.values()).map((s) => s.spend),
    1,
  );
  const maxScore = 5; // Max rating is 5

  const supplierPerformance: SupplierPerformance[] = Array.from(
    supplierSpend.entries(),
  )
    .sort((a, b) => b[1].spend - a[1].spend) // Sort by spend descending
    .map(([id, data]) => {
      const avgScore =
        data.scores.length > 0
          ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
          : 0;
      return {
        name: data.name,
        spend: data.spend, // Return absolute spend value
        spendPercent: Math.round((data.spend / maxSpend) * 100),
        score: Math.round((avgScore / maxScore) * 100),
        scoreVal: avgScore.toFixed(1),
        spendVal: `R${(data.spend / 1000).toFixed(1)}k`,
      };
    })
    .slice(0, 5); // Limit to top 5 suppliers

  // Generate Supply Disruption Heatmap (4 weeks x 7 days)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  // Get all AT_RISK events in the past 4 weeks
  const atRiskEvents = await prisma.event.findMany({
    where: {
      type: "delay_reported",
      timestamp: { gte: fourWeeksAgo },
      order: { vendorId },
    },
    select: { timestamp: true },
  });

  // Create 4x7 grid (4 weeks, 7 days each)
  const heatmap: number[][] = Array(4)
    .fill(0)
    .map(() => Array(7).fill(10)); // Default low risk

  atRiskEvents.forEach((event) => {
    const daysSince = Math.floor(
      (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSince >= 0 && daysSince < 28) {
      const week = Math.floor(daysSince / 7);
      const day = daysSince % 7;
      // Increment risk level (capped at 90 for max color)
      heatmap[week][day] = Math.min(heatmap[week][day] + 30, 90);
    }
  });

  // Format Delivered Orders for Table (return all for frontend pagination)
  const formattedDeliveredOrders: DeliveredOrder[] = deliveredOrders.map(
    (order) => {
      const acceptedVisibility = order.visibility.find(
        (v) => v.status === "ACCEPTED",
      );
      const supplierName = acceptedVisibility?.supplier.name || "Unknown";

      const orderSubtotal =
        order.subtotal ||
        (order.items as any[]).reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );
      const orderTotalWithTax = orderSubtotal * 1.08;

      return {
        id: order.orderNumber,
        orderNumber: order.orderNumber,
        supplier: supplierName,
        date: order.actualDeliveredAt
          ? new Date(order.actualDeliveredAt).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        value: `R${orderTotalWithTax.toFixed(2)}`,
        stars: order.rating?.score || 0,
      };
    },
  );

  // Calculate trends (compare last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentOrders = deliveredOrders.filter(
    (o) => o.actualDeliveredAt && o.actualDeliveredAt >= thirtyDaysAgo,
  );
  const previousOrders = deliveredOrders.filter(
    (o) =>
      o.actualDeliveredAt &&
      o.actualDeliveredAt >= sixtyDaysAgo &&
      o.actualDeliveredAt < thirtyDaysAgo,
  );

  const recentSpend = recentOrders.reduce((sum, order) => {
    const orderSubtotal =
      order.subtotal ||
      (order.items as any[]).reduce(
        (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 0),
        0,
      );
    return sum + orderSubtotal * 1.08;
  }, 0);

  const previousSpend = previousOrders.reduce((sum, order) => {
    const orderSubtotal =
      order.subtotal ||
      (order.items as any[]).reduce(
        (itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 0),
        0,
      );
    return sum + orderSubtotal * 1.08;
  }, 0);

  const spendTrend =
    previousSpend > 0
      ? `${(((recentSpend - previousSpend) / previousSpend) * 100).toFixed(1)}%`
      : "+0.0%";

  const recentReliable = recentOrders.filter((order) => {
    const hasAtRiskEvent = order.events.some((e) => e.type.includes("AT_RISK"));
    return !hasAtRiskEvent;
  }).length;

  const previousReliable = previousOrders.filter((order) => {
    const hasAtRiskEvent = order.events.some((e) => e.type.includes("AT_RISK"));
    return !hasAtRiskEvent;
  }).length;

  const recentReliabilityPct =
    recentOrders.length > 0 ? (recentReliable / recentOrders.length) * 100 : 0;
  const previousReliabilityPct =
    previousOrders.length > 0
      ? (previousReliable / previousOrders.length) * 100
      : 0;

  const reliabilityTrend =
    previousReliabilityPct > 0
      ? `${(recentReliabilityPct - previousReliabilityPct).toFixed(1)}%`
      : "+0.0%";

  return {
    totalSpend,
    totalSpendFormatted: `R${totalSpend.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    reliabilityPercentage,
    mostStableSupplier,
    stockoutsAvoided,
    supplierPerformance,
    disruptionHeatmap: heatmap,
    deliveredOrders: formattedDeliveredOrders,
    trends: {
      spendTrend,
      reliabilityTrend,
    },
  };
}

export async function getSupplierAnalytics(
  supplierId: string,
): Promise<SupplierAnalytics> {
  // Fetch all orders where this supplier HAS DELIVERED
  const deliveredOrders = await prisma.order.findMany({
    where: {
      deliveryState: "DELIVERED",
      visibility: {
        some: {
          supplierId,
          status: "ACCEPTED",
        },
      },
    },
    include: {
      vendor: { select: { name: true } },
      rating: true,
    },
    orderBy: { actualDeliveredAt: "desc" },
  });

  const formattedOrders = deliveredOrders.map((order) => {
    // Lead time calculation (Actual Delivery - Placed At)
    let leadTimeStr = "-";
    if (order.actualDeliveredAt && order.createdAt) {
      const diffMs =
        order.actualDeliveredAt.getTime() - order.createdAt.getTime();
      const diffDays = (diffMs / (1000 * 60 * 60 * 24)).toFixed(1);
      leadTimeStr = `${diffDays} Days`;
    }

    // Value calculation (with 8% tax)
    const orderSubtotal =
      order.subtotal ||
      (order.items as any[]).reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0,
      );
    const orderTotalWithTax = orderSubtotal * 1.08;

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      retailer: order.vendor?.name || "Unknown Retailer",
      date: order.actualDeliveredAt
        ? new Date(order.actualDeliveredAt).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
      value: `R ${orderTotalWithTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      leadTime: leadTimeStr,
      stars: order.rating?.score || 0,
      placedAt: order.createdAt,
    };
  });

  return {
    deliveredOrders: formattedOrders,
  };
}
