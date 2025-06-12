import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companies.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/users.js";

// i use express for backend in this project
const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to enable CORS for all routes and parse JSON requests
app.use(cors());
app.use(express.json());

// mount different api routes on specific paths
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/companies", companyRoutes); // Company-related routes
app.use("/api/dashboard", dashboardRoutes); // Dashboard-related routes
app.use("/api/users", userRoutes); // User-related routes

// server health check endpoint
app.get("/api/health", (req, res) => {
  // Return a JSON response with server status and timestamp
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
