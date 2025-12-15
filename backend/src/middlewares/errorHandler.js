import { v4 as uuidv4 } from "uuid";
import ErrorResponse from "../utils/errorResponse.js";
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
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 *
 * @returns {import("express").Response} JSON error response formatted by `createErrorResponse`.
 */
const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    req.transactionID = uuidv4();
    req.txnStart = Date.now();

    logger.error(
      `${req.transactionID} Request body contains invalid JSON, so throwing an error`
    );

    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(Constants.INVALID_JSON, 422),
        400
      )
    );
  }

  if (err.name === "ErrorResponse") {
    return res.send(createErrorResponse(req, res, err, 400));
  }

  if (err instanceof Error) {
    logger.error(
      `${
        req.transactionID
      } Internal Communication Error occurred :: ${err}, ${JSON.stringify(err)}`
    );

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
