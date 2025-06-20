import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { createActionHistory } from "./history.js";
import { authenticateJWT, authenticateLocal } from "../middleware/auth.js";
import {
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
  revokeRefreshToken,
} from "../utils/tokenUtils.js";

const router = express.Router();

// Login через Passport Local Strategy
router.post("/login", (req, res, next) => {
  authenticateLocal(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    
    if (!req.user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    try {
      // Generate token pair
      const tokens = await generateTokenPair(req.user.id);

      // Log login action
      try {
        await createActionHistory({
          action: "login",
          type: "auth",
          details: "User logged in successfully",
          target: req.user.email,
          userId: req.user.id,
        });
      } catch (historyError) {
        console.error("History logging error:", historyError);
      }

      res.json({
        user: req.user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
});

// Register with refresh token support
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "User",
      },
    });

    // Generate token pair for new user
    const tokens = await generateTokenPair(newUser.id);

    // Log registration action
    try {
      await createActionHistory({
        action: "created",
        type: "user",
        details: `User registered`,
        target: newUser.email,
        userId: newUser.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
    }

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh access token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const tokenData = await verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken(tokenData.userId);

    res.json({
      accessToken: newAccessToken,
      expiresIn: "15m",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: error.message });
  }
});

// Logout через Passport JWT
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      try {
        await revokeRefreshToken(refreshToken);
      } catch (error) {
        console.error('Error revoking refresh token:', error);
      }
    }
    
    // Log logout action
    try {
      await createActionHistory({
        action: "logout",
        type: "auth",
        details: "User logged out",
        target: req.user.email,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("History logging error:", historyError);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Alternative Passport.js protected route (example)
router.get("/profile-passport", authenticateJWT, async (req, res) => {
  try {
    res.json({ 
      user: req.user,
      message: "Authenticated via Passport.js JWT" 
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify через Passport JWT
router.get("/verify", authenticateJWT, async (req, res) => {
  try {
    res.json({ 
      user: req.user,
      authenticated: true 
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Profile через Passport JWT
router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
