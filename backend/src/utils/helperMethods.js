import { ZodError } from "zod";
import ErrorResponse from "./ErrorResponse.js";
import constants from "./constants.js";

/**
 * Handle and normalize validation errors.
 *
 * - If the error is already an `ErrorResponse`, it is re-thrown as-is.
 * - If the error is a `ZodError`, its issues are collected and returned
 *   as a new `ErrorResponse` with status 422.
 * - For all other errors, a generic `INTERNAL_COMMUNICATION_EXCEPTION`
 *   response is thrown with status 500.
 *
 * @function handleValidationErrors
 * @param {Error|import("zod").ZodError|ErrorResponse} error - The error thrown during validation or execution.
 * @param {string} transactionId - Unique transaction identifier for tracking/logging.
 *
 * @throws {ErrorResponse} Normalized error response depending on error type.
 */
export const handleValidationErrors = (error, transactionId) => {
  if (error instanceof ErrorResponse) {
    throw error;
  }

  const messages = [];
  if (error instanceof ZodError) {
    for (let err of error.issues) {
      messages.push(err.message);
    }
    throw new ErrorResponse(messages.join(", "), 422);
  } else {
    throw new ErrorResponse(constants.INTERNAL_COMMUNICATION_EXCEPTION, 500);
  }
};
