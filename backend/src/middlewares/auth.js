import { jwtVerify } from "jose";
import { createErrorResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import Constants from "../utils/constants.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
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

    res.locals.userId = payload.id;

    next();
  } catch (e) {
    if (e.code === "ERR_JWT_EXPIRED") {
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
