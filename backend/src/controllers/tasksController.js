import mongoose from "mongoose";
import { z, ZodError } from "zod";
import Task from "../models/Task.js";
import Board from "../models/Board.js";
import User from "../models/User.js";
import constants from "../utils/constants.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { createSuccessResponse } from "../models/responseMapper.js";
import { handleValidationErrors } from "../utils/helperMethods.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { objectIdRequestMapper } from "../models/objectIdRequestMapper.js";

/**
 * Controller to create a new task.
 *
 * This endpoint validates the incoming request body using Zod schema
 * before creating a new Task in the database.
 *
 * Expected request body:
 * - name {string} - Required, trimmed, at least 5 characters long.
 * - description {string} - Optional, trimmed, at least 5 characters if provided.
 * - status {"inProgress"|"completed"|"wontDo"|"toDo"} - Optional, defaults to "toDo".
 * - icon {string|null} - Optional, trimmed, can be null.
 *
 * @function createTaskController
 * @async
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response:
 * - Success: `{ task: <newlyCreatedTask> }`
 * - Failure: Validation errors or server errors handled by `handleValidationErrors`.
 *
 * @throws {ZodError} If the request body fails schema validation.
 */
export const createTaskController = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside createTaskController`);

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

    logger.debug(`${req.transactionID} Validating the request body`);

    const taskSchema = z
      .strictObject(
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
          status: z
            .enum(["inProgress", "completed", "wontDo", "toDo"])
            .default("toDo")
            .optional(),
          icon: z.string().trim().optional().nullable(),
          boardId: z
            .string()
            .trim()
            .refine(
              (val) => {
                return mongoose.Types.ObjectId.isValid(val);
              },
              { error: "ObjectId passed is invalid" },
            ),
        },
        { error: constants.UNKNOWN_PARAMETERS },
      )
      .refine(
        (data) => {
          return !!data.name;
        },
        {
          message: "Task name is required",
          path: ["name"],
        },
      );

    const result = await taskSchema.parseAsync(req.body);

    logger.debug(`${req.transactionID} Request body validated successfully`);

    logger.debug(
      `${req.transactionID} Checking if the boardId ${result.boardId} exists in the database`,
    );

    const doesBoardExist = await Board.findById(result.boardId);

    if (!doesBoardExist) {
      logger.error(
        `${req.transactionID} The boardId ${result.boardId} does not exists in the database, throwing error`,
      );

      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    const newTask = await Task.create({
      name: result.name,
      description: result.description,
      status: result.status,
      icon: result.icon,
      board: result.boardId,
    });

    logger.debug(
      `${req.transactionID} Successfully created a new task, and appending it to the tasks array in the board`,
    );

    await Board.findByIdAndUpdate(result.boardId, {
      $push: { tasks: newTask._id },
    });

    logger.debug(
      `${req.transactionID} Successfully pushed the taskID in the tasks array in the board, returning the new tasks created`,
    );

    return res.send(createSuccessResponse(req, res, { task: newTask }));
  } catch (error) {
    handleValidationErrors(error, req.transactionID);
  }
});

/**
 * Controller to update an existing task.
 *
 * This endpoint validates the incoming request body using a Zod schema
 * and updates the specified task if it exists.
 *
 * Expected request params:
 * - taskId {string} - The ID of the task to be updated.
 *
 * Expected request body (all fields optional):
 * - name {string} - Trimmed, at least 5 characters long.
 * - description {string} - Trimmed, at least 5 characters if provided.
 * - status {"inProgress"|"completed"|"wontDo"|"toDo"} - Defaults to "toDo".
 * - icon {string|null} - Optional, trimmed, can be null.
 *
 * @function updateTaskController
 * @async
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response:
 * - Success: `{ task: <updatedTask> }`
 * - Failure: 404 if task does not exist, validation errors, or other server errors.
 *
 * @throws {ErrorResponse} If the task does not exist.
 * @throws {ZodError} If the request body fails schema validation.
 */
export const updateTaskController = asyncHandler(async (req, res) => {
  try {
    logger.debug(`${req.transactionID} Inside updateTaskController`);

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

    await objectIdRequestMapper(req.params["taskId"], req.transactionID);

    logger.debug(`${req.transactionID} Validating the request body`);

    const taskSchema = z
      .strictObject(
        {
          name: z
            .string()
            .trim()
            .min(5, { error: "Task should have at least 5 characters" })
            .optional(),
          description: z
            .string()
            .trim()
            .min(5, {
              error: "Description should have at least 5 characters",
            })
            .optional(),
          status: z
            .enum(["inProgress", "completed", "wontDo", "toDo"])
            .optional(),
          icon: z.string().trim().optional(),
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
          message:
            "At least one key (name, description, status, or icon) must be present.",
          path: [],
        },
      );

    const result = await taskSchema.parseAsync(req.body);

    logger.debug(
      `${req.transactionID} Request body validated successfully and updating the task`,
    );

    const updatedTask = await Task.findByIdAndUpdate(
      req.params["taskId"],
      result,
      { new: true },
    );

    if (!updatedTask) {
      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    return res.send(createSuccessResponse(req, res, { task: updatedTask }));
  } catch (error) {
    handleValidationErrors(error, req.transactionID);
  }
});

/**
 * Controller to delete an existing task.
 *
 * This endpoint deletes a task by its ID if it exists.
 *
 * Expected request params:
 * - taskId {string} - The ID of the task to be deleted.
 *
 * @function deleteTaskController
 * @async
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 *
 * @returns {Promise<void>} Sends a JSON response:
 * - Success: `{ message: "Task with ID <taskId> deleted successfully" }`
 * - Failure: 404 if the task does not exist, or other server errors.
 *
 * @throws {ErrorResponse} If the task does not exist.
 */
export const deleteTaskController = asyncHandler(async (req, res) => {
  try {
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

    await objectIdRequestMapper(req.params["taskId"], req.transactionID);

    logger.debug(
      `${req.transactionID} Deleting the task with ID ${req.params["taskId"]}`,
    );

    const deleteTask = await Task.findByIdAndDelete(req.params["taskId"]);

    if (!deleteTask) {
      logger.error(
        `${req.transactionID} The task does not exist, so throwing error`,
      );

      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }

    logger.debug(
      `${req.transactionID} Removing the taskID from the tasks array from the board`,
    );

    await Board.findByIdAndUpdate(deleteTask.board, {
      $pull: { tasks: req.params["taskId"] },
    });

    logger.debug(
      `${req.transactionID} Successfully deleted the task with ID ${req.params["taskId"]} and removed it from the board ${deleteTask.board}`,
    );

    return res.send(
      createSuccessResponse(req, res, {
        message: `Task with ID ${req.params["taskId"]} deleted successfully`,
      }),
    );
  } catch (error) {
    handleValidationErrors(error, req.transactionID);
  }
});
