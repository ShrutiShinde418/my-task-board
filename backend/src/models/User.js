import mongoose from "mongoose";

/**
 * User Schema definition.
 *
 * Represents an application user with authentication details
 * and references to boards they own or have access to.
 * Includes automatic `createdAt` and `updatedAt` timestamps.
 *
 * @typedef {Object} User
 * @property {string} email - User's email address.
 * @property {string} password - User's hashed password.
 * @property {mongoose.Types.ObjectId[]} boardIds - Array of references to `Board` documents.
 * @property {Date} createdAt - Timestamp when the user was created (auto-generated).
 * @property {Date} updatedAt - Timestamp when the user was last updated (auto-generated).
 */
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    boardIds: {
      type: [mongoose.Types.ObjectId],
      ref: "Board",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Date,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
