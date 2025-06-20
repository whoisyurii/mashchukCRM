import express from "express";
import cors from "cors";
import path from "path";
import passport from "./middleware/passport.js";
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companies.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/users.js";
import historyRoutes from "./routes/history.js";
// swagger imports
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from "./swaggerSpec.js";

const app = express();

const PORT = process.env.PORT || 3001;

// middleware to enable CORS for all routes and parse JSON requests
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// initialize Passport auth middleware
app.use(passport.initialize());

// serve static files from public directory
app.use("/public", express.static(path.join(process.cwd(), "public")));

// mount different api routes on specific paths
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/companies", companyRoutes); // Company-related routes
app.use("/api/dashboard", dashboardRoutes); // Dashboard-related routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/history", historyRoutes); // History-related routes

// server health check endpoint
app.get("/api/health", (req, res) => {
  // Return a JSON response with server status and timestamp
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
