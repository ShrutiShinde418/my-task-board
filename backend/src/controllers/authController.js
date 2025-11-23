import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import constants from "../utils/constants.js";
import User from "../models/User.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import { authRequestMapper } from "../models/authRequestMapper.js";
import { objectIdRequestMapper } from "../models/objectIdRequestMapper.js";

/**
 * Controller to sign up a user
 *
 * This function handles the sign-up process of the user. If the user already exists, it throws an error, else creates a new user and returns the ObjectID
 *
 * @function signup
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the board ID on success
 *
 * @throws {Error} If signing up the user fails, the error is propagated to the error handler
 */
export const signup = asyncHandler(async (req, res) => {
  try {
    const result = await authRequestMapper(req);

    const existingUser = await User.findOne({ email: result.email });

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

    const hashedPassword = await bcrypt.hash(result.password, 12);

    const newUser = await User.create({
      email: result.email,
      password: hashedPassword,
    });

    return res.send(
      createSuccessResponse(req, res, {
        message: `User successfully created with ObjectID ${newUser._id}`,
      }),
    );
  } catch (e) {
    throw e;
  }
});

/**
 * Controller to log in a user
 *
 * This function manages user authentication by validating email and password, issuing a JWT, and setting a cookie.
 *
 * @function login
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the board ID on success
 *
 * @throws {Error} If signing up the user fails, the error is propagated to the error handler
 */
export const login = asyncHandler(async (req, res) => {
  try {
    const result = await authRequestMapper(req);

    const existingUser = await User.findOne({ email: result.email });

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

    const doesPasswordMatch = await bcrypt.compare(
      result.password,
      existingUser.password,
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

    const token = await new SignJWT({
      id: existingUser._id.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.TOKEN_EXPIRY)
      .setIssuer(process.env.ISSUER)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "strict",
      maxAge: Number(process.env.TOKEN_EXPIRY[0]) * 24 * 60 * 60 * 1000,
    });

    return res.send(
      createSuccessResponse(req, res, {
        message: `User with id ${existingUser._id} logged in successfully`,
      }),
    );
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to remove a user
 *
 * This function removes a user from the database
 *
 * @function removeUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the board ID on success
 *
 * @throws {Error} If removing the user fails, the error is propagated to the error handler
 */
export const removeUser = asyncHandler(async (req, res) => {
  try {
    await objectIdRequestMapper(req.params.userId, req.transactionId);

    const removeUser = await User.findByIdAndDelete(req.params.userId);

    if (!removeUser) {
      return res.send(
        createErrorResponse(
          req,
          res,
          new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424),
          400,
        ),
      );
    }

    return res.send(
      createSuccessResponse(req, res, {
        message: `User with id ${removeUser._id} removed successfully`,
      }),
    );
  } catch (error) {
    throw error;
  }
});
