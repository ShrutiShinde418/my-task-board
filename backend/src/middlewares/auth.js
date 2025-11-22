import jose from "jose";
import { createErrorResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import Constants from "../utils/constants.js";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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

    const payload = await jose.jwtVerify(token, secret, {
      issuer: process.env.ISSUER,
    });

    res.locals.userId = payload.id;

    next();
  } catch (e) {
    return res.send(
      createErrorResponse(req, res, new ErrorResponse(e.message, 500), 500),
    );
  }
};
