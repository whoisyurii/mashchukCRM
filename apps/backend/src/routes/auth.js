import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { createActionHistory } from "./history.js";
import { authenticateToken } from "../middleware/auth.js";
import { passportJWT } from "../middleware/passport.js";
import {
  generateTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  generateAccessToken,
} from "../utils/tokenUtils.js";

const router = express.Router();

// Login with refresh token support
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token pair (access + refresh)
    const tokens = await generateTokenPair(user.id);

    // Log login action
    try {
      await createActionHistory({
        action: "login",
        type: "auth",
        details: `User logged in`,
        target: user.email,
        userId: user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
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

// logout (revoke refresh token) - using default middleware
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // revoke specific refresh token
      await revokeRefreshToken(refreshToken);
    } else {
      // revoke all tokens for this user
      await revokeAllUserTokens(req.user.id);
    }

    // Log logout action
    try {
      await createActionHistory({
        action: "logout",
        type: "auth",
        details: `User logged out`,
        target: req.user.email,
        userId: req.user.id,
      });
    } catch (historyError) {
      console.error("Error logging action history:", historyError);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Alternative Passport.js protected route (example)
router.get("/profile-passport", passportJWT, async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token endpoint
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword, valid: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
