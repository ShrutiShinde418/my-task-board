import mongoose from "mongoose";

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
