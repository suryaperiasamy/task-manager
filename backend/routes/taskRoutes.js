const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Import the auth middleware to protect these routes
const { protect } = require("../middleware/authMiddleware");

// Apply the protect middleware to ALL task routes
// This means a user must be logged in with a valid JWT token to access any of these
router.use(protect);

// GET /api/tasks (Get all tasks)
// POST /api/tasks (Create new task)
// We can chain routes that have the same path but different HTTP methods
router.route("/")
  .get(getTasks)
  .post(createTask);

// PUT /api/tasks/:id (Update a specific task)
// DELETE /api/tasks/:id (Delete a specific task)
router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
