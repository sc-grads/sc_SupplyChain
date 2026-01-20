import prisma from "../config/db.js";

// Helper for temporary type safety until full client regen
const db = prisma as any;

export async function createRating(data: {
  orderId: string;
  vendorId: string;
  supplierId: string;
  score: number;
  comment?: string;
  isAccurate?: boolean;
}) {
  return await db.rating.create({
    data: {
      score: data.score,
      comment: data.comment,
      isAccurate: data.isAccurate ?? true,
      orderId: data.orderId,
      vendorId: data.vendorId,
      supplierId: data.supplierId,
    },
  });
}

export async function getSupplierRating(supplierId: string) {
  // Aggregate average score
  const aggregation = await db.rating.aggregate({
    _avg: {
      score: true,
    },
    _count: {
      score: true,
    },
    where: {
      supplierId,
    },
  });

  // Calculate Accuracy % (Count of isAccurate=true / Total Ratings)
  const accuracyCount = await db.rating.count({
    where: {
      supplierId,
      isAccurate: true,
    },
  });

  const totalRatings = aggregation._count.score || 0;
  const accuracyPercentage =
    totalRatings > 0 ? (accuracyCount / totalRatings) * 100 : 0;

  return {
    averageScore: aggregation._avg.score || 0,
    totalRatings: totalRatings,
    accuracyPercentage: Math.round(accuracyPercentage),
  };
}
