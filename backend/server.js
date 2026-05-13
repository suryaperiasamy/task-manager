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
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
// Parse incoming JSON requests
app.use(express.json());

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

// Mount routes
// All authentication related requests will start with /api/auth
app.use("/api/auth", authRoutes);
// All task related requests will start with /api/tasks
app.use("/api/tasks", taskRoutes);

const connectDB = require("./config/db");

// Database connection and Server startup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Start the server only if the database connection is successful
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
