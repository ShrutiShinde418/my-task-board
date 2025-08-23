import { v4 as uuidv4 } from "uuid";
import ErrorResponse from "../utils/ErrorResponse.js";
import Constants from "../utils/constants.js";
import { createErrorResponse } from "../models/responseMapper.js";

/**
 * Global error handling middleware.
 *
 * Handles different types of errors and formats them into a standard error response.
 *
 * Error handling logic:
 * - **SyntaxError** (invalid JSON body): Returns 422 with `Constants.INVALID_JSON`.
 * - **ErrorResponse** (custom application errors): Returns error with status 400.
 * - **Error** (general/unexpected errors): Returns 500 with `Constants.INTERNAL_COMMUNICATION_EXCEPTION`.
 *
 * @function errorHandler
 * @param {Error|ErrorResponse|SyntaxError} err - The error object thrown during request handling.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {import("express").Response} JSON error response formatted by `createErrorResponse`.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  if (err instanceof SyntaxError && "body" in err) {
    req.transactionID = uuidv4();
    req.txnStart = Date.now();

    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(Constants.INVALID_JSON, 422),
        400
      )
    );
  }

  if (err instanceof ErrorResponse) {
    return res.send(createErrorResponse(req, res, error, 400));
  }

  if (err instanceof Error) {
    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(Constants.INTERNAL_COMMUNICATION_EXCEPTION, 500),
        500
      )
    );
  }
};

export default errorHandler;
