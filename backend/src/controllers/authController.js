import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import constants from "../utils/constants.js";
import User from "../models/User.js";
import { createSuccessResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/errorResponse.js";
import { authRequestMapper } from "../models/authRequestMapper.js";
import { objectIdRequestMapper } from "../models/objectIdRequestMapper.js";
import Task from "../models/Task.js";
import Board from "../models/Board.js";

/**
 * Controller to sign up a user
 *
 * This function handles the sign-up process of the user. If the user already exists, it throws an error, else creates a new user and returns the ObjectID
 *
 * @function signup
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the user ID in the response
 *
 * @throws {Error} If signing up the user fails, the error is propagated to the error handler
 */
export const signup = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside signup controller`);

    logger.debug(`${req.transactionID} Validating the request body`);

    const result = await authRequestMapper(req);

    logger.debug(`${req.transactionID} Request body validated successfully`);

    const existingUser = await User.findOne({ email: result.email });

    if (existingUser) {
      logger.error(
        `${req.transactionID} User already exists with ID ${existingUser._id}, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_ALREADY_EXISTS, 423);
    }

    const hashedPassword = await bcrypt.hash(result.password, 12);

    const board = await Board.create({
      name: "My Task Board",
      description: "Tasks to keep organised",
    });

    const newUser = await User.create({
      email: result.email,
      password: hashedPassword,
      boards: [board._id],
    });

    logger.debug(
      `${req.transactionID} Successfully created new user with email: ${result.email}`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `User successfully created with ObjectID ${newUser._id} and boardID ${board._id}`,
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
 * @returns {Promise<object>} Sends a JSON response with the user's details, like the boards created.
 *
 * @throws {Error} If signing up the user fails, the error is propagated to the error handler
 */
export const login = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside login controller`);

    logger.debug(`${req.transactionID} Validating the request body`);

    const result = await authRequestMapper(req);

    const existingUser = await User.findOne({ email: result.email }).populate({
      path: "boards",
      populate: { path: "tasks" },
    });

    logger.debug(`${req.transactionID} Request body validated successfully`);

    if (!existingUser) {
      logger.error(
        `${req.transactionID} User already exists, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    const doesPasswordMatch = await bcrypt.compare(
      result.password,
      existingUser.password,
    );

    if (!doesPasswordMatch) {
      logger.error(
        `${req.transactionID} Email or password doesn't match, so throwing error`,
      );

      throw new ErrorResponse(constants.EMAIL_OR_PASSWORD_IS_INVALID, 425);
    }

    logger.debug(
      `${req.transactionID} Create JWT token to be stored as a cookie`,
    );

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

    logger.debug(
      `${req.transactionID} User with id ${existingUser._id} logged in successfully`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `User with id ${existingUser._id} logged in successfully`,
        boards: existingUser.boards,
      }),
    );
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to retrieve user details
 *
 * This function fetches user details, like the task boards created by the user and the tasks associated with them and returns them
 *
 * @function getUserDetails
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the user's board details on success
 *
 * @throws {Error} If signing up the user fails, the error is propagated to the error handler
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside getUserDetails controller`);

    const existingUser = await User.findById(res.locals.userId).populate({
      path: "boards",
      populate: { path: "tasks" },
    });

    if (!existingUser) {
      logger.error(
        `${req.transactionID} User doesn't exist, so throwing an error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    logger.debug(
      `${req.transactionID} Fetched user details with id ${existingUser._id} successfully`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `User Details with id ${existingUser._id} logged in successfully`,
        boards: existingUser.boards,
      }),
    );
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to remove a user
 *
 * This function removes a user from the database, with its associated board and tasks
 *
 * @function removeUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<object>} Sends a JSON response with the message indicating which user was removed
 *
 * @throws {Error} If removing the user fails, the error is propagated to the error handler
 */
export const removeUser = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside removeUser controller`);

    logger.debug(
      `${req.transactionID} Validating the ObjectID passed as params`,
    );

    await objectIdRequestMapper(req.params.userId, req.transactionID);

    logger.debug(
      `${req.transactionID} Request body has been successfully validated`,
    );

    const removeUser = await User.findByIdAndDelete(req.params.userId).populate(
      {
        path: "boards",
        populate: { path: "tasks" },
      },
    );

    if (!removeUser) {
      logger.error(
        `${req.transactionID} User with ID ${req.params.userId} not found, throwing an error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    const boardIds = removeUser.boards.map((board) => board._id);
    const taskIdsArray = removeUser.boards.reduce((acc, board) => {
      const ids = board.tasks.map((task) => task._id);
      acc.push(...ids);

      return acc;
    }, []);

    logger.debug(
      `${req.transactionID} Removing tasks :: ${taskIdsArray ?? "None present"} associated with the user`,
    );

    const deletedTasks = await Task.deleteMany({
      _id: { $in: taskIdsArray },
    });

    logger.debug(
      `${req.transactionID} Removing boards :: ${boardIds ?? "None present"} associated with the user`,
    );

    const deletedBoards = await Board.deleteMany({
      _id: { $in: boardIds },
    });

    logger.debug(
      `${req.transactionID} User with id ${removeUser._id} removed successfully with ${deletedBoards.deletedCount ?? 0} board(s) deleted and ${deletedTasks.deletedCount ?? 0} task(s) deleted`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `User with id ${removeUser._id} removed successfully with ${deletedBoards.deletedCount ?? 0} board(s) deleted and ${deletedTasks.deletedCount ?? 0} task(s) deleted`,
      }),
    );
  } catch (error) {
    throw error;
  }
});
