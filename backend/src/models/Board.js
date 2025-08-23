import mongoose from "mongoose";

/**
 * Board Schema definition.
 *
 * Represents a collection of tasks grouped under a board.
 * Includes automatic `createdAt` and `updatedAt` timestamps.
 *
 * @typedef {Object} Board
 * @property {string} name - Name of the board.
 * @property {string} description - Description of the board.
 * @property {mongoose.Types.ObjectId[]} tasks - Array of references to `Task` documents.
 * @property {Date} createdAt - Timestamp when the board was created (auto-generated).
 * @property {Date} updatedAt - Timestamp when the board was last updated (auto-generated).
 */
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
