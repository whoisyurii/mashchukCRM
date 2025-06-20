import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateJWT } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
import { createActionHistory } from "./history.js";

const prisma = new PrismaClient();

// i'm using multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public", "companies");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `company-${req.params.id || "new"}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit and 1024x1024 resolution
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = express.Router();

// Get all companies with pagination, search, and filtering
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "",
      minCapital = "",
      maxCapital = "",
      createdAfter = "",
      createdBefore = "",
    } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause for search and filters
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

    // Capital filters
    if (minCapital || maxCapital) {
      where.capital = {};
      if (minCapital) where.capital.gte = parseInt(minCapital);
      if (maxCapital) where.capital.lte = parseInt(maxCapital);
    }

    // Date filters
    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) where.createdAt.gte = new Date(createdAfter);
      if (createdBefore) where.createdAt.lte = new Date(createdBefore);
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get companies with pagination and owner info
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip,
        take,
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
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        actionHistory: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
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
router.post("/", authenticateJWT, upload.single('logo'), async (req, res) => {
  try {
    // Check if user has permission to create companies
    if (req.user.role === "User") {
      return res.status(401).json({
        message:
          "Access denied. Only SuperAdmin and Admin can create companies.",
      });
    }

    const { name, service, capital, status, ownerId } = req.body;
    const logoFile = req.file;

    // Generate logo URL if file was uploaded
    let logoUrl = null;
    if (logoFile) {
      logoUrl = `/companies/${logoFile.filename}`;
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        service,
        capital: parseInt(capital),
        status: status || "Active",
        userId: ownerId || null,
        logoUrl: logoUrl,
      },
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

    // Log action history
    try {
      await createActionHistory({
        action: "created",
        type: "company",
        details: `Created new company '${newCompany.name}'`,
        target: newCompany.name,
        userId: req.user.id,
        companyId: newCompany.id,
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
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { owner: true },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check permissions - only owner, admin, or superadmin can edit
    const canEdit =
      req.user.role === "SuperAdmin" ||
      req.user.role === "Admin" ||
      (company.userId && company.userId === req.user.id);

    if (!canEdit) {
      return res.status(403).json({
        message: "Access denied. You can only edit companies you own.",
      });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body,
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

    // Log action history
    try {
      await createActionHistory({
        action: "updated",
        type: "company",
        details: `Updated company information for '${updatedCompany.name}'`,
        target: updatedCompany.name,
        userId: req.user.id,
        companyId: updatedCompany.id,
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
router.delete("/:id", authenticateJWT, async (req, res) => {
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
        companyId: company.id,
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

// Upload company logo
router.post(
  "/:id/logo",
  authenticateJWT,
  upload.single("logo"),
  async (req, res) => {
    try {
      const company = await prisma.company.findUnique({
        where: { id: req.params.id },
        include: { owner: true },
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Check permissions
      const canEdit =
        req.user.role === "SuperAdmin" ||
        req.user.role === "Admin" ||
        (company.userId && company.userId === req.user.id);

      if (!canEdit) {
        return res.status(403).json({
          message: "Access denied. You can only edit companies you own.",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Delete old logo if exists
      if (company.logoUrl) {
        const oldLogoPath = path.join(process.cwd(), "public", company.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }

      // Update company with new logo URL
      const logoUrl = `companies/${req.file.filename}`;
      const updatedCompany = await prisma.company.update({
        where: { id: req.params.id },
        data: { logoUrl },
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

      // Log action history
      try {
        await createActionHistory({
          action: "updated",
          type: "company",
          details: `Updated logo for company '${updatedCompany.name}'`,
          target: updatedCompany.name,
          userId: req.user.id,
          companyId: updatedCompany.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
      }

      res.json({
        message: "Logo uploaded successfully",
        logoUrl: logoUrl,
        company: updatedCompany,
      });
    } catch (error) {
      console.error("Error uploading logo:", error);

      // Clean up uploaded file if database update fails
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete company logo
router.delete("/:id/logo", authenticateJWT, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { owner: true },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check permissions
    const canEdit =
      req.user.role === "SuperAdmin" ||
      req.user.role === "Admin" ||
      (company.userId && company.userId === req.user.id);

    if (!canEdit) {
      return res.status(403).json({
        message: "Access denied. You can only edit companies you own.",
      });
    }

    if (!company.logoUrl) {
      return res.status(400).json({ message: "No logo to delete" });
    }

    // Delete file from filesystem
    const logoPath = path.join(process.cwd(), "public", company.logoUrl);
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    // Update company to remove logo URL
    const updatedCompany = await prisma.company.update({
      where: { id: req.params.id },
      data: { logoUrl: null },
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

    // Log action history
    try {
      await createActionHistory({
        action: "updated",
        type: "company",
        details: `Removed logo for company '${updatedCompany.name}'`,
        target: updatedCompany.name,
        userId: req.user.id,
        companyId: updatedCompany.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
    }

    res.json({
      message: "Logo deleted successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
