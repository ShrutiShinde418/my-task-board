import { asyncHandler } from "../middlewares/asyncHandler.js";
import { z } from "zod";
import ErrorResponse from "../utils/errorResponse.js";
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
    logger.debug(
      `${req.transactionID} Inside createBoardController controller`,
    );

    logger.debug(
      `${req.transactionID} Verifying is the userId in the token is present in the db`,
    );

    const user = await User.findById(res.locals.userId);

    if (!user) {
      logger.error(
        `${req.transactionID} User does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    logger.debug(`${req.transactionID} Creating a new board`);

    const board = await Board.create({
      name: "My Task Board",
      description: "Tasks to keep organised",
    });

    logger.debug(
      `${req.transactionID} Adding boardID ${board._id} to the userID's ${user._id} boards array`,
    );

    user.boards.push(board._id);

    await user.save();

    logger.debug(
      `${req.transactionID} Successfully added boardID ${board._id} to user's ${res.locals.userId} board array`,
    );

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
    logger.debug(`${req.transactionID} Inside getBoardController controller`);

    logger.debug(
      `${req.transactionID} Verifying is the userId in the token is present in the db`,
    );

    const user = await User.findById(res.locals.userId);

    if (!user) {
      logger.error(
        `${req.transactionID} User does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    logger.debug(
      `${req.transactionID} Validating the ObjectID passed as params`,
    );

    await objectIdRequestMapper(req.params.boardId, req.transactionID);

    logger.debug(
      `${req.transactionID} Fetching board details for board with ID ${req.params.boardId}`,
    );

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      logger.error(
        `${req.transactionID} The board with ID ${req.params.boardId} does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    logger.debug(
      `${req.transactionID} Successfully fetched board details, returning the same`,
    );

    return res.send(createSuccessResponse(req, res, board._doc));
  } catch (error) {
    throw error;
  }
});

/**
 * Controller to update a board by its ID.
 *
 * Updates a board document from the database using the `boardId` provided
 * in the request parameters. Returns the updated board data in a standardized success response.
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
    logger.debug(
      `${req.transactionID} Inside updateBoardController controller`,
    );

    logger.debug(
      `${req.transactionID} Verifying is the userId in the token is present in the db`,
    );

    const user = await User.findById(res.locals.userId);

    if (!user) {
      logger.error(
        `${req.transactionID} User does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    logger.debug(
      `${req.transactionID} Validating the object ID ${req.params.boardId} passed as params`,
    );

    await objectIdRequestMapper(req.params.boardId, req.transactionID);

    logger.debug(`${req.transactionID} Validating the request body`);

    const boardSchema = z
      .strictObject(
        {
          name: z
            .string()
            .trim()
            .min(5, { error: "Board name should have at least 5 characters" })
            .optional(),
          description: z
            .string()
            .trim()
            .min(5, { error: "Description should have at least 5 characters" })
            .optional(),
        },
        { error: constants.UNKNOWN_PARAMETERS },
      )
      .refine(
        (data) => {
          return Object.values(data).some(
            (value) => value !== undefined || true,
          );
        },
        {
          message: "At least one key (name, description) must be present.",
          path: [],
        },
      );

    const result = await boardSchema.parseAsync(req.body);

    logger.debug(`${req.transactionID} Request body validated successfully`);

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.boardId,
      result,
      { new: true },
    );

    if (!updatedBoard) {
      logger.error(
        `${req.transactionID} The board with ID ${req.params.boardId} does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    logger.debug(
      `${req.transactionID} Board with ID ${updatedBoard._id} updated successfully`,
    );

    return res.send(createSuccessResponse(req, res, updatedBoard._doc));
  } catch (error) {
    handleValidationErrors(error, req.transactionID);
  }
});

/**
 * Controller to delete a board by its ID.
 *
 * Deletes a board document from the database using the `boardId` provided
 * in the request parameters. The controller also deletes the tasks associated with the board and return a success message on the number of tasks deleted.
 *
 * @async
 * @function deleteBoardController
 * @param {Function} req - Express request object.
 * @param {Function} res - Express response object.
 * @throws {ErrorResponse} Will throw an error if the board does not exist
 * or if validation fails.
 * @returns {Promise<Object>} A success response confirming
 * the deletion of the board and its associated tasks.
 */
export const deleteBoardController = asyncHandler(async (req, res) => {
  try {
    logger.debug(
      `${req.transactionID} Inside deleteBoardController controller`,
    );

    logger.debug(
      `${req.transactionID} Verifying is the userId in the token is present in the db`,
    );

    const user = await User.findById(res.locals.userId);

    if (!user) {
      logger.error(
        `${req.transactionID} User does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.USER_DOES_NOT_EXIST, 424);
    }

    logger.debug(
      `${req.transactionID} Validating the objectID passed as params`,
    );

    await objectIdRequestMapper(req.params.boardId, req.transactionID);

    const deletedBoard = await Board.findByIdAndDelete(req.params.boardId);

    if (!deletedBoard) {
      logger.error(
        `${req.transactionID} The board with ID ${req.params.boardId} does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    logger.debug(
      `${req.transactionID} Removing boardID ${deletedBoard._id} from user ID's ${res.locals.userId} boards array`,
    );

    await User.findByIdAndUpdate(res.locals.userId, {
      $pull: { boards: req.params.boardId },
    });

    logger.debug(
      `${req.transactionID} Deleting all tasks present in the board with ID ${deletedBoard._id}`,
    );

    const deleteTasks = await Task.deleteMany({
      _id: { $in: deletedBoard.tasks },
    });

    logger.debug(
      `${req.transactionID} Board with ID ${req.params["boardId"]} deleted successfully with ${deleteTasks.deletedCount ?? 0} task(s)`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `Board with ID ${req.params["boardId"]} deleted successfully with ${deleteTasks.deletedCount ?? 0} task(s).`,
      }),
    );
  } catch (error) {
    handleValidationErrors(error, req.transactionID);
  }
});
