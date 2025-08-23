import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    boardIds: {
      type: [mongoose.Types.ObjectId],
      ref: "Board",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
