import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Generate access token (short-lived)
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * Store refresh token in database
 */
export const storeRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

/**
 * Verify refresh token from database
 */
export const verifyRefreshToken = async (token) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken) {
    throw new Error("Invalid refresh token");
  }

  if (refreshToken.expiresAt < new Date()) {
    // Token expired, delete it
    await prisma.refreshToken.delete({
      where: { token },
    });
    throw new Error("Refresh token expired");
  }

  return refreshToken;
};

/**
 * Revoke refresh token (for logout)
 */
export const revokeRefreshToken = async (token) => {
  await prisma.refreshToken.delete({
    where: { token },
  });
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

/**
 * Clean up expired tokens (should be run periodically)
 */
export const cleanExpiredTokens = async () => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};

/**
 * Generate token pair
 */
export const generateTokenPair = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await storeRefreshToken(userId, refreshToken);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
};

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY };
