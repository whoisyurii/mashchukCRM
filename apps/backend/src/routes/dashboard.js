import express from "express";
import bcrypt from "bcryptjs";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
import { createActionHistory } from "./history.js";

const prisma = new PrismaClient();

const router = express.Router();

// Get dashboard statistics
router.get("/stats", authenticateJWT, async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole === "SuperAdmin" || userRole === "Admin") {
      // For SuperAdmin and Admin - show all stats
      const [totalUsers, totalCompanies, activeCompanies, companies] =
        await Promise.all([
          prisma.user.count(),
          prisma.company.count(),
          prisma.company.count({ where: { status: "Active" } }),
          prisma.company.findMany({ select: { capital: true } }),
        ]);

      const totalCapital = companies.reduce(
        (sum, company) => sum + company.capital,
        0
      );

      res.json({
        totalUsers,
        totalCompanies,
        activeCompanies,
        totalCapital,
      });
    } else {
      // For User - show only accessible companies
      const [userCompanies, activeUserCompanies] = await Promise.all([
        prisma.company.findMany({
          where: {
            OR: [
              { userId: req.user.id },
              { userId: null }, // Include unassigned companies for now
            ],
          },
          select: { capital: true, status: true },
        }),
        prisma.company.count({
          where: {
            status: "Active",
            OR: [{ userId: req.user.id }, { userId: null }],
          },
        }),
      ]);

      const totalCapital = userCompanies.reduce(
        (sum, company) => sum + company.capital,
        0
      );

      res.json({
        totalCompanies: userCompanies.length,
        activeCompanies: activeUserCompanies,
        totalCapital,
      });
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get admins list (SuperAdmin only)
router.get(
  "/admins",
  authenticateJWT,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const admins = await prisma.user.findMany({
        where: { role: "Admin" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create new admin (SuperAdmin only)
router.post(
  "/admins",
  authenticateJWT,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: "Admin",
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      // Log action history
      try {
        await createActionHistory({
          action: "created",
          type: "user",
          details: `Created new admin account`,
          target: newAdmin.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
        // Don't fail the main operation if history logging fails
      }

      res.status(201).json(newAdmin);
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update admin (SuperAdmin only)
router.put(
  "/admins/:id",
  authenticateJWT,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { email, firstName, lastName } = req.body;

      const admin = await prisma.user.findFirst({
        where: { id, role: "Admin" },
      });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const updatedAdmin = await prisma.user.update({
        where: { id },
        data: { email, firstName, lastName },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      // Log action history
      try {
        await createActionHistory({
          action: "updated",
          type: "user",
          details: `Updated admin profile`,
          target: updatedAdmin.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
        // Don't fail the main operation if history logging fails
      }

      res.json(updatedAdmin);
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete admin (SuperAdmin only)
router.delete(
  "/admins/:id",
  authenticateJWT,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const admin = await prisma.user.findFirst({
        where: { id, role: "Admin" },
      });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      await prisma.user.delete({
        where: { id },
      });

      // Log action history
      try {
        await createActionHistory({
          action: "deleted",
          type: "user",
          details: `Deleted admin account`,
          target: admin.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
        // Don't fail the main operation if history logging fails
      }

      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get user's companies (User role)
router.get(
  "/user-companies",
  authenticateJWT,
  requireRole(["User"]),
  async (req, res) => {
    try {
      // Get companies assigned to the user or all companies if user is not assigned specific ones
      const userCompanies = await prisma.company.findMany({
        where: {
          OR: [
            { userId: req.user.id },
            { userId: null }, // Include unassigned companies for now
          ],
        },
      });
      res.json(userCompanies);
    } catch (error) {
      console.error("Error fetching user companies:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get companies sorted by capital descending (for all roles)
router.get("/companies-by-capital", authenticateJWT, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    // const userRole = req.user.role;

    let whereClause = {};

    // commented for future features 
    // for User role - show only their companies or unassigned ones
    // if (userRole === "User") {
    //   whereClause = {
    //     OR: [{ userId: req.user.id }, { userId: null }],
    //   };
    // }
    // For Admin and SuperAdmin - show all companies (whereClause remains empty)

    const companies = await prisma.company.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        capital: true,
        status: true,
        service: true,
        userId: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        capital: "desc",
      },
      take: parseInt(limit),
    });

    // Transform data to match frontend expectations
    const transformedCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      capital: company.capital,
      status: company.status,
      service: company.service,
      user: company.owner
        ? {
            firstName: company.owner.firstName,
            lastName: company.owner.lastName,
          }
        : null,
    }));

    res.json(transformedCompanies);
  } catch (error) {
    console.error("Error fetching companies by capital:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
