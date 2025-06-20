import express from "express";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all action history with pagination, search, and filtering
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 4,
      search = "",
      type = "",
      action = "",
      companyId = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // prisma query condition to filter actionHistory
    const where = {};

    if (search) {
      // .OR is prisma logical operator to combine multiple conditions
      where.OR = [
        { details: { contains: search, mode: "insensitive" } },
        { target: { contains: search, mode: "insensitive" } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (type) {
      where.type = type;
    }
    if (action) {
      where.action = action;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get history with pagination and user details
    const [history, totalCount] = await Promise.all([
      prisma.actionHistory.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.actionHistory.count({ where }),
    ]);

    res.json({
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching action history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single action history entry
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const history = await prisma.actionHistory.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!history) {
      return res.status(404).json({ message: "Action history not found" });
    }

    res.json(history);
  } catch (error) {
    console.error("Error fetching action history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to create action history entry
export const createActionHistory = async (data) => {
  try {
    return await prisma.actionHistory.create({
      data: {
        action: data.action,
        type: data.type,
        details: data.details,
        target: data.target,
        userId: data.userId,
        companyId: data.companyId || null,
      },
    });
  } catch (error) {
    console.error("Error creating action history:", error);
    throw error;
  }
};

export default router;
