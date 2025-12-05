import { jwtVerify } from "jose";
import { createErrorResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import Constants from "../utils/constants.js";

export const authMiddleware = async (req, res, next) => {
  try {
    logger.debug(`${req.transactionID} Inside authMiddleware`);

    const { token } = req.cookies;

    if (!token) {
      logger.error(
        `${req.transactionID} Token not passed as a cookie, throwing error`,
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
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
      {
        issuer: process.env.ISSUER,
      },
    );

    logger.debug(
      `${req.transactionID} Payload decoded successfully, setting userId in res.locals`,
    );

    res.locals.userId = payload.id;

    next();
  } catch (e) {
    logger.error(
      `${req.transactionID} Error occurred while verifying JWT :: ${e}, ${JSON.stringify(e)}`,
    );

    if (e.code === "ERR_JWT_EXPIRED") {
      logger.error(
        `${req.transactionID} The token passed is expired, throwing an error`,
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
