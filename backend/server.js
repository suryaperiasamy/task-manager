require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route files (we'll create these later)
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Initialize Express app
const app = express();

// Middleware
// Enable CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, 
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ].filter(Boolean),
  credentials: true
}));
// Parse incoming JSON requests
app.use(express.json());

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

// Diagnostic route to test the /api prefix
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date() });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Catch-all 404 handler for debugging
app.use((req, res) => {
  console.log(`404 Error: Path ${req.originalUrl} not found on this server.`);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    suggestion: "Check if the path starts with /api/auth or /api/tasks"
  });
});

const connectDB = require("./config/db");

// Database connection and Server startup
const PORT = process.env.PORT || 5000;

// Debug: Check if env variables are loaded (Censored for safety)
console.log("--- Environment Variable Check ---");
console.log("MONGO_URI:", process.env.MONGO_URI ? "LOADED ✅" : "MISSING ❌");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "LOADED ✅" : "MISSING ❌");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED ✅" : "MISSING ❌");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");
console.log("---------------------------------");

// Connect to MongoDB
connectDB().then(() => {
  // Start the server only if the database connection is successful
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
