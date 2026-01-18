import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as inventoryController from "../controllers/inventory.controller.js";
import * as orderController from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// Health Check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// Inventory Routes
router.get("/inventory", authenticate, inventoryController.getInventory);
router.post("/inventory", authenticate, inventoryController.updateInventory);

// Order Routes
router.get("/orders", authenticate, orderController.getOrders);
router.post("/orders", authenticate, orderController.createOrder);
router.get(
  "/orders/new-requests",
  authenticate,
  orderController.getNewRequests,
);
router.patch("/orders/:id/cancel", authenticate, orderController.cancelOrder);
router.patch("/orders/:id/accept", authenticate, orderController.acceptOrder);
router.patch("/orders/:id/decline", authenticate, orderController.declineOrder);

export default router;
