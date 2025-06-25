import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { createActionHistory } from "./history.js";
import { authenticateJWT, authenticateLocal } from "../middleware/passport.js";
import {
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
  revokeRefreshToken,
} from "../utils/tokenUtils.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 */
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/profile-passport:
 *   get:
 *     summary: Get user profile (Passport.js example)
 *     description: Alternative endpoint to get user profile using Passport.js JWT authentication
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     description: Verify if the provided JWT token is valid and return user information
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                 authenticated:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get current authenticated user's profile information
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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
