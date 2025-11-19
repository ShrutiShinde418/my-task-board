import bcrypt from "bcrypt";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import constants from "../utils/constants.js";
import User from "../models/User.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import { authRequestMapper } from "../models/authRequestMapper.js";
import { jwt } from "zod";

export const signup = asyncHandler(async (req, res) => {
  const result = await authRequestMapper(req, res);

  const existingUser = User.findOne({ email: result.email });

  if (existingUser) {
    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(constants.USER_ALREADY_EXISTS, 423),
        400,
      ),
    );
  }

  const hashedPassword = bcrypt.hash(result.password, 12);

  const newUser = await User.create({
    email: result.email,
    password: hashedPassword,
  });

  return res.send(
    createSuccessResponse(req, res, {
      message: `User successfully created with ObjectID ${newUser._id}`,
    }),
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await authRequestMapper(req, res);

  const existingUser = User.findOne({ email: result.email });

  if (!existingUser) {
    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424),
        400,
      ),
    );
  }

  const doesPasswordMatch = bcrypt.compare(
    existingUser.password,
    result.password,
  );

  if (!doesPasswordMatch) {
    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(constants.EMAIL_OR_PASSWORD_IS_INVALID, 425),
        400,
      ),
    );
  }

  const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
    iss: process.env.ISSUER,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "strict",
    maxAge: process.env.TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
  });

  return res.send(
    createSuccessResponse(req, res, {
      message: `User with id ${existingUser._id} logged in successfully`,
    }),
  );
});
