import express from "express";
import { companies } from "../data/companies.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all companies with pagination, search, and filtering
router.get("/", authenticateToken, (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "",
    } = req.query;

    let filteredCompanies = [...companies];

    // Apply search filter
    if (search) {
      filteredCompanies = filteredCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.service.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.status === status
      );
    }

    // Apply sorting
    filteredCompanies.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

    res.json({
      data: paginatedCompanies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredCompanies.length,
        totalPages: Math.ceil(filteredCompanies.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single company
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const company = companies.find((c) => c.id === req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create company
router.post("/", authenticateToken, (req, res) => {
  try {
    // Check if user has permission to create companies
    if (req.user.role === "User") {
      return res.status(401).json({
        message:
          "Access denied. Only SuperAdmin and Admin can create companies.",
      });
    }

    const { name, service, capital, status } = req.body;

    const newCompany = {
      id: (companies.length + 1).toString(),
      name,
      service,
      capital: parseInt(capital),
      status: status || "Active",
      createdAt: new Date().toISOString(),
    };

    companies.push(newCompany);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update company
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const companyIndex = companies.findIndex((c) => c.id === req.params.id);
    if (companyIndex === -1) {
      return res.status(404).json({ message: "Company not found" });
    }

    companies[companyIndex] = { ...companies[companyIndex], ...req.body };
    res.json(companies[companyIndex]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete company
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const companyIndex = companies.findIndex((c) => c.id === req.params.id);
    if (companyIndex === -1) {
      return res.status(404).json({ message: "Company not found" });
    }

    companies.splice(companyIndex, 1);
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
