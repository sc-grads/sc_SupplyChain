import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      businessEmail,
      password,
      name,
      companyName,
      role,
      phone,
      address,
      primaryGoods,
      contactPersonName,
      businessType,
    } = req.body;

    // Aliases for form matching
    const finalEmail = (email || businessEmail)?.toLowerCase();
    const finalName = companyName || name;

    if (!finalEmail || !password || !role) {
      return res.status(400).json({
        message: "Email (or businessEmail), password, and role are required.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: finalEmail },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role.toUpperCase() === "SUPPLIER" ? "SUPPLIER" : "VENDOR";

    const user = await prisma.user.create({
      data: {
        email: finalEmail,
        password: hashedPassword,
        name: finalName,
        phone,
        role: userRole,
        // Vendor-specific fields (stored on User for prototype simplicity)
        contactPersonName,
        address: userRole === "VENDOR" ? address : null,
        businessType,
      },
    });

    // Create supplier profile if role is SUPPLIER
    if (user.role === "SUPPLIER") {
      await prisma.supplierProfile.create({
        data: {
          supplierId: user.id,
          address, // Supplier-specific address
          primaryGoods,
          serviceAreas: ["Johannesburg CBD"], // Default for prototype
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to register.", details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to login.", details: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Logout successful." });
};
