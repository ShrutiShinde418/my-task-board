import { ZodError } from "zod";
import ErrorResponse from "./ErrorResponse.js";
import constants from "./constants.js";

export const handleValidationErrors = (error, transactionId) => {
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
