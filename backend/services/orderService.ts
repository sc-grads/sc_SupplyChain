import prisma from "../config/db.js";
import {
  findEligibleSuppliers,
  createOrderVisibility,
} from "./visibilityService.js";
import { createNotification } from "./notificationService.js";
import { sendDelayNotificationEmail } from "./emailService.js";

export async function createOrder(data: {
  vendorId: string;
  items: { sku: string; quantity: number; name?: string; price?: number }[]; // JSON shape
  partialAllowed: boolean;
  deliveryLocation: string;
  requiredDeliveryDate: Date;
  deliveryAddress: string;
  promisedDeliveryAt?: Date;
  predictedDeliveryAt?: Date;
}) {
  const order = await prisma.order.create({
    data: {
      vendorId: data.vendorId,
      orderNumber: `ORD-${Date.now()}`, // Simple unique number
      items: data.items, // JSON array
      partialAllowed: data.partialAllowed,
      deliveryLocation: data.deliveryLocation,
      requiredDeliveryDate: data.requiredDeliveryDate,
      deliveryAddress: data.deliveryAddress,
      promisedDeliveryAt: data.promisedDeliveryAt,
      predictedDeliveryAt: data.predictedDeliveryAt,
      orderState: "PENDING",
      deliveryState: "ON_TRACK",
    } as any,
  });

  // Run Automation #1
  const { eligibleSuppliers: eligibleSupplierIds } =
    await findEligibleSuppliers(order.id);

  if (eligibleSupplierIds.length === 0) {
    // Graceful degradation: Mark at risk, log event, notify vendor (stub for now)
    await prisma.order.update({
      where: { id: order.id },
      data: { deliveryState: "AT_RISK" },
    });
    await logEvent({
      type: "no_suppliers_found",
      orderId: order.id,
      details: { message: "No eligible suppliers — order at risk." },
    });
    // TODO: Send vendor notification (e.g., via Twilio/ACS)
    console.log("Vendor notified: No matching suppliers.");

    // Refresh the order object to include the 'AT_RISK' state
    return await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  } else {
    await createOrderVisibility(order.id, eligibleSupplierIds);
    await logEvent({
      type: "order_distributed",
      orderId: order.id,
      details: { eligibleCount: eligibleSupplierIds.length },
    });
  }

  return order;
}

export async function getOrdersByVendor(vendorId: string) {
  return await prisma.order.findMany({
    where: { vendorId },
    include: {
      vendor: true,
      events: { orderBy: { timestamp: "asc" } },
      visibility: {
        include: { supplier: true },
      },
    },
  });
}

export async function cancelOrder(orderId: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      orderState: "CANCELLED" as any,
    },
  });
}

export async function acceptOrder(orderId: string, supplierId: string) {
  // 1. Update Visibility
  await prisma.orderVisibility.update({
    where: {
      orderId_supplierId: { orderId, supplierId },
    },
    data: { status: "ACCEPTED" },
  });

  // 2. Update Order State
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderState: "ACCEPTED",
    },
  });

  // 3. Log Event
  await logEvent({
    type: "order_accepted",
    orderId,
    details: { supplierId },
  });

  return order;
}

export async function declineOrder(orderId: string, supplierId: string) {
  // 1. Update Visibility
  await prisma.orderVisibility.update({
    where: {
      orderId_supplierId: { orderId, supplierId },
    },
    data: { status: "DECLINED" },
  });

  // 2. Log Event
  await logEvent({
    type: "order_declined",
    orderId,
    details: { supplierId },
  });

  // Note: We might want to check if all suppliers declined to mark as AT_RISK
  return { success: true };
}

export async function getNewRequests(supplierId: string) {
  return await prisma.order.findMany({
    where: {
      visibility: {
        some: {
          supplierId,
          status: "VISIBLE",
        },
      },
      orderState: "PENDING",
    },
    include: { vendor: { select: { name: true } } },
  });
}

export async function getOrdersBySupplier(supplierId: string) {
  // Get all orders where this supplier has accepted the order
  return await prisma.order.findMany({
    where: {
      visibility: {
        some: {
          supplierId,
          status: "ACCEPTED",
        },
      },
    },
    include: {
      vendor: { select: { name: true, email: true } },
      events: { orderBy: { timestamp: "asc" } },
      visibility: {
        where: { supplierId },
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveOrdersForSupplier(supplierId: string) {
  return await prisma.order.findMany({
    where: {
      visibility: {
        some: {
          supplierId,
          status: "ACCEPTED",
        },
      },
      orderState: "ACCEPTED",
      deliveryState: {
        in: ["ON_TRACK", "AT_RISK"],
      },
    },
    include: {
      vendor: {
        select: { name: true, email: true },
      },
      visibility: {
        where: { supplierId },
        select: { status: true },
      },
      events: { orderBy: { timestamp: "asc" } },
      // Optional: items for more detail
    },
    orderBy: [{ requiredDeliveryDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function updateDeliveryStatus(orderId: string, status: string) {
  // 1. Log Event for all statuses
  await logEvent({
    type: status, // "OUT_FOR_DELIVERY", "IN_TRANSIT", "DELIVERED"
    orderId,
    details: { message: `Order is ${status.replace(/_/g, " ").toLowerCase()}` },
  });

  // 2. Only update the actual DB status if it matches the high-level schema enum
  const enumValues = ["ON_TRACK", "AT_RISK", "DELIVERED", "FAILED"];
  const updateData: any = {};
  if (enumValues.includes(status)) {
    updateData.deliveryState = status;
  }

  if (status === "DELIVERED") {
    updateData.actualDeliveredAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      vendor: { select: { name: true, email: true } },
      events: { orderBy: { timestamp: "asc" } },
    },
  });

  return order;
}

export async function reportDelay(
  orderId: string,
  revisedETA: Date,
  reason: string,
) {
  // 1. Update order with new predicted ETA and ensure it's marked AT_RISK
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      predictedDeliveryAt: revisedETA,
      deliveryState: "AT_RISK",
    },
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      events: { orderBy: { timestamp: "asc" } },
    },
  });

  // 2. Log delay event
  await logEvent({
    type: "delay_reported",
    orderId,
    details: {
      reason,
      revisedETA,
      reportedAt: new Date(),
    },
  });

  // 3. Create In-App Notification for the Vendor
  await createNotification({
    userId: order.vendorId,
    title: "Order Delay Alert",
    message: `Order #${order.orderNumber} is delayed. New ETA: ${revisedETA.toLocaleString()}. Reason: ${reason}`,
    type: "delay",
    orderId: order.id,
  });

  // 4. Send Email Notification
  await sendDelayNotificationEmail(
    order.orderNumber,
    revisedETA.toLocaleString(),
    reason,
  );

  return order;
}

// Helper for events (observability)
async function logEvent(data: {
  type: string;
  orderId?: string;
  details?: any;
}) {
  await prisma.event.create({
    data: {
      type: data.type,
      details: data.details,
      orderId: data.orderId,
    },
  });
}
