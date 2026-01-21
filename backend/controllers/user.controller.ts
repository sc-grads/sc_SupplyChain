import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

// Update User Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId; // From authMiddleware
    const {
      name,
      phone,
      address,
      companyName, // Maps to User.name for vendors if used that way, or could be separate
      businessCategory, // Maps to User.businessType
      contactPersonName, // Vendor specific
      supplierAddress, // Supplier specific
    } = req.body;

    // 1. Update Core User Data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || companyName, // Prefer name, fallback to companyName
        phone,
        // Update vendor-specific fields directly on User model
        address: address,
        businessType: businessCategory,
        contactPersonName: contactPersonName,
      },
    });

    // 2. If Supplier, update SupplierProfile
    if (updatedUser.role === "SUPPLIER") {
      const supplierProfile = await prisma.supplierProfile.findUnique({
        where: { supplierId: userId },
      });

      if (supplierProfile) {
        await prisma.supplierProfile.update({
          where: { supplierId: userId },
          data: {
            // Update supplier specific fields if provided
            address: supplierAddress || address, // Fallback to main address if supplierAddress is missing
            // If we had more fields like primaryGoods, update here
          },
        });
      }
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({
      message: "Profile updated successfully.",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile.", error: error.message });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ message: "Failed to update password.", error: error.message });
  }
};
