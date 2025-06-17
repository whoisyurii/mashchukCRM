import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// JWT Strategy for Passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      if (user) {
        return done(null, { userId: payload.userId, ...user });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Passport middleware for optional JWT authentication
export const passportJWT = passport.authenticate("jwt", { session: false });

// Middleware wrapper for optional authentication
export const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user || null;
    next();
  })(req, res, next);
};

export default passport;
