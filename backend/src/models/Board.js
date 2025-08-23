import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    tasks: {
      type: [mongoose.Types.ObjectId],
      ref: "Task",
    },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

export default Board;
