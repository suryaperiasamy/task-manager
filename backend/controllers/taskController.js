const Task = require("../models/Task");

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private (requires login)
const getTasks = async (req, res) => {
  try {
    // Find tasks where the createdBy field matches the logged-in user's ID
    const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user._id, // Assign the logged-in user as the creator
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Make sure the user trying to update the task is the one who created it
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this task" });
    }

    // Update the task with new data from the request body
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the updated document rather than the old one
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Make sure the user trying to delete the task is the one who created it
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne(); // Delete the task from the database

    res.status(200).json({ id: req.params.id, message: "Task removed successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
