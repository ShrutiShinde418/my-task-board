import { jwtVerify } from "jose";
import { createErrorResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import Constants from "../utils/constants.js";
import { decryptData } from "../utils/helperMethods.js";

import { getTransactionIdFromAsyncStore } from "./startTransaction.js";

/**
 * Authentication middleware to verify JWT from cookies.
 *
 * - Expects a `token` cookie containing a valid JWT.
 * - Verifies the token using `jose.jwtVerify`.
 * - On success, sets `res.locals.userId` from the token payload and calls `next()`.
 * - On failure, sends a standardized error response.
 *
 * @async
 * @function authMiddleware
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 *
 * @returns {Promise<void>} Sends an error response or calls `next()`.
 *
 * @throws {Error} When JWT verification fails due to unexpected errors.
 */
export const authMiddleware = async (req, res, next) => {
  const transactionID = getTransactionIdFromAsyncStore();

  try {
    logger.debug(`${transactionID} Inside authMiddleware`);

    const cookieName =
      process.env.NODE_ENV === "prod" ? "__Host-session_id" : "auth_session";

    if (!req.cookies[cookieName]) {
      logger.error(
        `${transactionID} Token not passed as a cookie, throwing error`,
      );

      return res.send(
        createErrorResponse(
          req,
          res,
          new ErrorResponse(Constants.AUTHENTICATION_FAILED, 401),
          401,
        ),
      );
    }

    const { payload } = await jwtVerify(
      await decryptData(req.cookies[cookieName], process.env.AES_KEY),
      new TextEncoder().encode(process.env.JWT_SECRET),
      {
        issuer: process.env.ISSUER,
      },
    );

    logger.debug(
      `${transactionID} Payload decoded successfully, setting userId in res.locals`,
    );

    res.locals.userId = payload.id;

    next();
  } catch (e) {
    logger.error(
      `${transactionID} Error occurred while verifying JWT :: ${e.message}, ${JSON.stringify(e)}`,
    );

    if (e.code === "ERR_JWT_EXPIRED") {
      logger.error(
        `${transactionID} The token passed is expired, throwing an error`,
      );

      return res.send(
        createErrorResponse(
          req,
          res,
          new ErrorResponse(Constants.TOKEN_EXPIRED, 401),
          401,
        ),
      );
    }

    return res.send(
      createErrorResponse(req, res, new ErrorResponse(e.message, 500), 500),
    );
  }
};
