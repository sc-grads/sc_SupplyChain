import { Request, Response } from "express";
import { getRecommendations } from "../services/recommendationService.js";

export const getVendorRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId; // From authMiddleware
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};
