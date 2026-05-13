const mongoose = require("mongoose");

// Define the Task schema structure
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "", // Description is optional
      trim: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"], // Only these values are allowed
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null, // Optional due date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This links the task to a specific User
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
