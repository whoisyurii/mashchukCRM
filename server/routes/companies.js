import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
import { createActionHistory } from "./history.js";

const prisma = new PrismaClient();

const router = express.Router();

// Get all companies with pagination, search, and filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "",
    } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause for search and status
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { service: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get companies with pagination
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single company
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create company
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to create companies
    if (req.user.role === "User") {
      return res.status(401).json({
        message:
          "Access denied. Only SuperAdmin and Admin can create companies.",
      });
    }

    const { name, service, capital, status } = req.body;

    const newCompany = await prisma.company.create({
      data: {
        name,
        service,
        capital: parseInt(capital),
        status: status || "Active",
      },
    });

    // Log action history
    try {
      await createActionHistory({
        action: "created",
        type: "company",
        details: `Created new company '${newCompany.name}'`,
        target: newCompany.name,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
      // Don't fail the main operation if history logging fails
    }

    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update company
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body,
    });

    // Log action history
    try {
      await createActionHistory({
        action: "updated",
        type: "company",
        details: `Updated company information for '${updatedCompany.name}'`,
        target: updatedCompany.name,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
      // Don't fail the main operation if history logging fails
    }

    res.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete company
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await prisma.company.delete({
      where: { id: req.params.id },
    });

    // Log action history
    try {
      await createActionHistory({
        action: "deleted",
        type: "company",
        details: `Deleted company '${company.name}'`,
        target: company.name,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
      // Don't fail the main operation if history logging fails
    }

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
