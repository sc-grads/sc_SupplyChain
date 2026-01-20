import { Request, Response } from "express";
import * as notificationService from "../services/notificationService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      details: error.message,
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id as string);
    res.json({ message: "Notification marked as read" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to mark notification as read",
      details: error.message,
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await notificationService.markAllAsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to mark all as read", details: error.message });
  }
};
