import mongoose from "mongoose";

/**
 * Establish a connection to the MongoDB database.
 *
 * Uses the `MONGODB_URL` environment variable to connect via Mongoose.
 * Logs a success message on successful connection, or exits the process
 * if the connection fails.
 *
 * @function connectDB
 * @async
 * @returns {Promise<void>} Resolves when the database is successfully connected.
 *
 * @throws {Error} If the connection fails, logs the error and exits the process with code 1.
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB database", error);
    process.exit(1);
  }
};
