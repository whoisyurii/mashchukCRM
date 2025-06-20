import express from "express";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get action history with pagination and filtering
 *     description: Retrieve system action history with pagination, search, and filtering capabilities
 *     tags:
 *       - History
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for details, target, or user names
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by action type (user, company, auth, etc.)
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action name (created, updated, deleted, etc.)
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Action history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       type:
 *                         type: string
 *                       details:
 *                         type: string
 *                       target:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           email:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           role:
 *                             type: string
 *                       company:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /history/{id}:
 *   get:
 *     summary: Get single action history entry
 *     description: Retrieve detailed information about a specific action history entry
 *     tags:
 *       - History
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Action history entry ID
 *     responses:
 *       200:
 *         description: Action history entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 action:
 *                   type: string
 *                 type:
 *                   type: string
 *                 details:
 *                   type: string
 *                 target:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: Action history not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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
