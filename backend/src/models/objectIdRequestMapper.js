import mongoose from "mongoose";
import { z } from "zod";
import { handleValidationErrors } from "../utils/helperMethods.js";

/**
 * @function objectIdRequestMapper
 * @description Validates and sanitizes a MongoDB ObjectId string using Zod.
 *              If the input is invalid, it delegates error handling to `handleValidationErrors`.
 *
 * @param {string} objectId - The ObjectId string to validate and sanitize.
 * @param {string} transactionId - A unique identifier for tracing the request, used in error handling.
 *
 * @returns {Promise<string>} A trimmed and validated ObjectId string.
 *
 * @throws {ErrorResponse} If the ObjectId is invalid or fails schema validation.
 */
export const objectIdRequestMapper = async (objectId, transactionId) => {
  try {
    const schema = z
      .string()
      .trim()
      .refine(
        (val) => {
          return mongoose.Types.ObjectId.isValid(val);
        },
        { error: "ObjectId passed is invalid" },
      );

    return await schema.parseAsync(objectId);
  } catch (error) {
    handleValidationErrors(error, transactionId);
  }
};
