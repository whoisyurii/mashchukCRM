import express from "express";
import bcrypt from "bcryptjs";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
import { createActionHistory } from "./history.js";

const prisma = new PrismaClient();

const router = express.Router();

// Get all users (admin only)
router.get(
  "/",
  authenticateToken,
  requireRole(["SuperAdmin", "Admin"]),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
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
          details: `Created new user account`,
          target: newUser.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
        // Don't fail the main operation if history logging fails
      }

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { password, role, ...allowedUpdates } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: allowedUpdates,
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
        type: "profile",
        details: "Updated profile information",
        target: updatedUser.email,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
      // Don't fail the main operation if history logging fails
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user by ID (SuperAdmin and Admin)
router.put(
  "/:id",
  authenticateToken,
  requireRole(["SuperAdmin", "Admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body;

      // Get the user being updated
      const userToUpdate = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true, email: true },
      });

      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }

      // Role validation logic
      if (req.user.role === "Admin") {
        // Admins can only edit Users, not SuperAdmins or other Admins
        if (
          userToUpdate.role === "SuperAdmin" ||
          userToUpdate.role === "Admin"
        ) {
          return res.status(403).json({
            message: "Admins can only edit users with User role",
          });
        }
        // Admins can only assign User role
        if (updateData.role && updateData.role !== "User") {
          return res.status(403).json({
            message: "Admins can only assign User role",
          });
        }
      }

      // Prevent SuperAdmin from removing their own SuperAdmin role
      if (
        userToUpdate.role === "SuperAdmin" &&
        userToUpdate.id === req.user.id &&
        updateData.role &&
        updateData.role !== "SuperAdmin"
      ) {
        return res.status(403).json({
          message: "Cannot remove your own SuperAdmin privileges",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
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
          details: `Updated user account`,
          target: updatedUser.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });

    // Log action history
    try {
      await createActionHistory({
        action: "updated",
        type: "profile",
        details: "Changed password",
        target: req.user.email,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
      // Don't fail the main operation if history logging fails
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (SuperAdmin only)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["SuperAdmin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Don't allow self-deletion
      if (id === req.user.id) {
        return res
          .status(400)
          .json({ message: "Cannot delete your own account" });
      }

      // Get user info before deletion for history
      const userToDelete = await prisma.user.findUnique({
        where: { id },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete user
      await prisma.user.delete({
        where: { id },
      });

      // Log action history
      try {
        await createActionHistory({
          action: "deleted",
          type: "user",
          details: `Deleted user account`,
          target: userToDelete.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("Error logging action history:", historyError);
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
