import { asyncHandler } from "../middlewares/asyncHandler.js";
import { z } from "zod";
import ErrorResponse from "../utils/ErrorResponse.js";
import constants from "../utils/constants.js";
import Board from "../models/Board.js";
import { handleValidationErrors } from "../utils/helperMethods.js";
import { createSuccessResponse } from "../models/responseMapper.js";
import { objectIdRequestMapper } from "../models/objectIdRequestMapper.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

/**
 * Controller to create a new task board.
 *
 * This function handles the creation of a default task board with a predefined
 * name and description. It returns a success response containing the newly
 * created board's ID.
 *
 * @function createBoardController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends a JSON response with the board ID on success
 *
 * @throws {Error} If board creation fails, the error is propagated to the error handler
 */
export const createBoardController = asyncHandler(async (req, res) => {
  try {
    const board = await Board.create({
      name: "My Task Board",
      description: "Tasks to keep organised",
    });

    const user = await User.findById(res.locals.userId);
    user.boards.push(board._id);

    await user.save();

    return res.send(createSuccessResponse(req, res, { boardId: board._id }));
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to retrieve a specific task board by ID.
 *
 * Fetches a board document from the database using the `boardId` provided
 * in the request parameters. Returns the board data in a standardized success response.
 *
 * @function getBoardController
 * @async
 * @param {import('express').Request} req - Express request object containing `boardId` in `req.params`
 * @param {import('express').Response} res - Express response object used to send the board data
 * @returns {Promise<void>} Sends a JSON response with the board object on success
 *
 * @throws {Error} If the board retrieval fails or the ID is invalid, the error is passed to the error handler
 */
export const getBoardController = asyncHandler(async (req, res) => {
  try {
    await objectIdRequestMapper(req.params.boardId, req.transactionId);

    const board = await Board.findById(req.params.boardId);

    return res.send(createSuccessResponse(req, res, board));
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to update a board by its ID.
 *
 * @async
 * @function updateBoardController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {ErrorResponse} Will throw an error if the board does not exist
 * or if validation fails.
 * @returns {Promise<Object>} A success response containing
 * the updated board document.
 */
export const updateBoardController = asyncHandler(async (req, res) => {
  try {
    await objectIdRequestMapper(req.params.boardId, req.transactionId);

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }
    const boardSchema = z.strictObject(
      {
        name: z
          .string()
          .trim()
          .min(5, { error: "Task should have at least 5 characters" }),
        description: z
          .string()
          .trim()
          .min(5, { error: "Description should have at least 5 characters" })
          .optional(),
      },
      { error: constants.UNKNOWN_PARAMETERS },
    );

    const result = await boardSchema.parseAsync(req.body);

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.boardId,
      result,
      { new: true },
    );

    return res.send(createSuccessResponse(req, res, updatedBoard));
  } catch (error) {
    handleValidationErrors(error, req.transactionId);
  }
});

/**
 * Controller to delete a board by its ID.
 *
 * @async
 * @function deleteBoardController
 * @param {Function} req - Express request object.
 * @param {Function} res - Express response object.
 * @throws {ErrorResponse} Will throw an error if the board does not exist
 * or if validation fails.
 * @returns {Promise<Object>} A success response confirming
 * the deletion of the board.
 */
export const deleteBoardController = asyncHandler(async (req, res) => {
  try {
    await objectIdRequestMapper(req.params.boardId, req.transactionId);

    const deletedBoard = await Board.findByIdAndDelete(req.params.boardId);

    if (!deletedBoard) {
      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    const user = await User.findByIdAndUpdate(res.locals.userId, {
      $pull: { boards: req.params.boardId },
    });

    if (!user) {
      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    const deleteTasks = await Task.deleteMany({
      _id: { $in: deletedBoard.tasks },
    });

    return res.send(
      createSuccessResponse(req, res, {
        message: `Board with ID ${req.params["boardId"]} deleted successfully with ${deleteTasks.deletedCount} tasks.`,
      }),
    );
  } catch (error) {
    handleValidationErrors(error, req.transactionId);
  }
});
