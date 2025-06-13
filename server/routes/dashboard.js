import express from "express";
import bcrypt from "bcryptjs";
import { companies } from "../data/companies.js";
import { users } from "../data/users.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats", authenticateToken, (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole === "SuperAdmin" || userRole === "Admin") {
      // For SuperAdmin and Admin - show all stats
      const totalUsers = users.length;
      const totalCompanies = companies.length;
      const activeCompanies = companies.filter(
        (c) => c.status === "Active"
      ).length;
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
      const userCompanies = companies.filter((c) => c.userId === req.user.id);
      const totalCompanies = userCompanies.length;
      const activeCompanies = userCompanies.filter(
        (c) => c.status === "Active"
      ).length;
      const totalCapital = userCompanies.reduce(
        (sum, company) => sum + company.capital,
        0
      );

      res.json({
        totalCompanies,
        activeCompanies,
        totalCapital,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get admins list (SuperAdmin only)
router.get(
  "/admins",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  (req, res) => {
    try {
      const admins = users
        .filter((user) => user.role === "Admin")
        .map(({ password, ...admin }) => admin);
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create new admin (SuperAdmin only)
router.post(
  "/admins",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newAdmin = {
        id: (users.length + 1).toString(),
        email,
        firstName,
        lastName,
        password: bcrypt.hashSync(password, 10),
        role: "Admin",
        createdAt: new Date().toISOString(),
      };

      users.push(newAdmin);
      const { password: _, ...adminWithoutPassword } = newAdmin;
      res.status(201).json(adminWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update admin (SuperAdmin only)
router.put(
  "/admins/:id",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  (req, res) => {
    try {
      const { id } = req.params;
      const { email, firstName, lastName } = req.body;

      const adminIndex = users.findIndex(
        (u) => u.id === id && u.role === "Admin"
      );
      if (adminIndex === -1) {
        return res.status(404).json({ message: "Admin not found" });
      }

      users[adminIndex] = { ...users[adminIndex], email, firstName, lastName };
      const { password, ...adminWithoutPassword } = users[adminIndex];
      res.json(adminWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete admin (SuperAdmin only)
router.delete(
  "/admins/:id",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  (req, res) => {
    try {
      const { id } = req.params;
      const adminIndex = users.findIndex(
        (u) => u.id === id && u.role === "Admin"
      );

      if (adminIndex === -1) {
        return res.status(404).json({ message: "Admin not found" });
      }

      users.splice(adminIndex, 1);
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get user's companies (User role)
router.get(
  "/user-companies",
  authenticateToken,
  requireRole(["User"]),
  (req, res) => {
    try {
      const userCompanies = companies.filter((c) => c.userId === req.user.id);
      res.json(userCompanies);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
