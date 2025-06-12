import jwt from "jsonwebtoken";
import { users } from "../data/users.js";

// Secret key for JWT stored in .env || backup
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware to authenticate JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  // async verify that the token using the secret key
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token is invalid, return 403 Forbidden
      return res.status(403).json({ message: "Invalid token" });
    }

    // Find the user by the decoded user ID
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      // If user is not found, return 403 Forbidden
      return res.status(403).json({ message: "User not found" });
    }

    // Attach the user object to the request and proceed to the next middleware
    req.user = user;
    next();
  });
};

/**
 * Higher-order function to create middleware that checks user roles.
 * @param {Array} roles - The allowed roles.
 * @returns {Function} Middleware function to check roles.
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    // If no user is attached to the request, return 401 Unauthorized
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // If the user's role is not in the allowed roles, return 403 Forbidden
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // If the user has the required role, proceed to the next middleware
    next();
  };
};
