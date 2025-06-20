import passport from './passport.js';

// Экспортируем Passport middleware
export const authenticateJWT = passport.authenticate('jwt', { session: false });
export const authenticateLocal = passport.authenticate('local', { session: false });

// Backward compatibility
export const authenticateToken = authenticateJWT;

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

/**
 * Middleware для проверки владельца ресурса или админа
 */
export const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const resourceUserId = req.params.userId || req.body.userId;
  const isOwner = req.user.id === resourceUserId;
  const isAdmin = ['Admin', 'SuperAdmin'].includes(req.user.role);

  if (isOwner || isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};
