import mongoose from "mongoose";

/**
 * Task Schema definition.
 *
 * Represents a task entity with basic attributes such as name, description, status, and icon.
 * Includes automatic `createdAt` and `updatedAt` timestamps.
 *
 * @typedef {Object} Task
 * @property {string} name - Name of the task.
 * @property {string} description - Detailed description of the task.
 * @property {string} status - Current status of the task (e.g., "toDo", "inProgress", "completed", "wontDo").
 * @property {string} icon - Optional icon representing the task.
 * @property {Date} createdAt - Timestamp when the task was created (auto-generated).
 * @property {Date} updatedAt - Timestamp when the task was last updated (auto-generated).
 */
const taskSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    status: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
