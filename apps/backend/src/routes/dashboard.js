import express from "express";
import bcrypt from "bcryptjs";
import { authenticateJWT } from "../middleware/passport.js";
import { requireRole } from "../middleware/auth.js";
import { createActionHistory } from "./history.js";
import prisma from "../prisma.js";

const router = express.Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve dashboard statistics based on user role (different data for different roles)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of users (Admin/SuperAdmin only)
 *                 totalCompanies:
 *                   type: integer
 *                   description: Total number of companies
 *                 activeCompanies:
 *                   type: integer
 *                   description: Number of active companies
 *                 totalCapital:
 *                   type: number
 *                   description: Total capital amount
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /dashboard/admins:
 *   get:
 *     summary: Get list of admin users
 *     description: Retrieve list of all admin users (SuperAdmin only)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   role:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Access denied - SuperAdmin only
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /dashboard/admins:
 *   post:
 *     summary: Create new admin user
 *     description: Create a new admin user account (SuperAdmin only)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin email address
 *               firstName:
 *                 type: string
 *                 description: Admin first name
 *               lastName:
 *                 type: string
 *                 description: Admin last name
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin password
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: User already exists
 *       403:
 *         description: Access denied - SuperAdmin only
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /dashboard/admins/{id}:
 *   put:
 *     summary: Update admin user
 *     description: Update admin user information (SuperAdmin only)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Admin not found
 *       403:
 *         description: Access denied - SuperAdmin only
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /dashboard/admins/{id}:
 *   delete:
 *     summary: Delete admin user
 *     description: Delete an admin user account (SuperAdmin only)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       403:
 *         description: Access denied - SuperAdmin only
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /dashboard/user-companies:
 *   get:
 *     summary: Get user's assigned companies
 *     description: Retrieve companies assigned to the current user (User role only)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   service:
 *                     type: string
 *                   capital:
 *                     type: number
 *                   status:
 *                     type: string
 *                   logoUrl:
 *                     type: string
 *       403:
 *         description: Access denied - User role only
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get user's companies (User/Admin role)
router.get(
  "/user-companies",
  authenticateJWT,
  requireRole(["User", "Admin"]),
  async (req, res) => {
    try {
      const { limit = 4 } = req.query;
      
      // Get only companies owned by the current user, sorted by capital (top companies)
      const userCompanies = await prisma.company.findMany({
        where: {
          userId: req.user.id, // Only companies created by this user
        },
        orderBy: {
          capital: "desc", // Sort by capital descending (top companies first)
        },
        take: parseInt(limit), // Limit to specified number (default 4)
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
      res.json(userCompanies);
    } catch (error) {
      console.error("Error fetching user companies:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /dashboard/companies-by-capital:
 *   get:
 *     summary: Get companies sorted by capital
 *     description: Retrieve companies ordered by capital amount in descending order
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of companies to return
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   capital:
 *                     type: number
 *                   status:
 *                     type: string
 *                   service:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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
