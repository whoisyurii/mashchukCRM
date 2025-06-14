import express from "express";
import bcrypt from "bcryptjs";
import { users } from "../data/users.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get(
  "/",
  authenticateToken,
  requireRole(["SuperAdmin", "Admin"]),
  (req, res) => {
    try {
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create new user (SuperAdmin only)
router.post(
  "/",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName, role = "User" } = req.body;

      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get current user profile
router.get("/me", authenticateToken, (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/me", authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, role, ...allowedUpdates } = req.body;
    users[userIndex] = { ...users[userIndex], ...allowedUpdates };

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
