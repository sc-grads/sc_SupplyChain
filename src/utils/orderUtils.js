export const isOrderAtRisk = (order) => {
  if (!order) return false;

  // Exclude cancelled and delivered orders
  if (
    order.orderState === "CANCELLED" ||
    order.deliveryState === "DELIVERED" ||
    order.actualDeliveredAt
  ) {
    return false;
  }

  // 1. Check for 60-minute prediction delay (Precision Logic)
  if (order.promisedDeliveryAt && order.predictedDeliveryAt) {
    const promised = new Date(order.promisedDeliveryAt);
    const predicted = new Date(order.predictedDeliveryAt);

    // Difference in minutes
    const diffInMinutes =
      (predicted.getTime() - promised.getTime()) / (1000 * 60);

    if (diffInMinutes >= 60) return true;
  }

  // 2. Fallback: Check if current time is past the required delivery date (Basic Logic)
  // Only if we don't have the precision fields or they haven't triggered a risk yet
  const deadline = new Date(order.requiredDeliveryDate);
  const now = new Date();

  return now > deadline;
};
