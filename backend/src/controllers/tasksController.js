import Task from "../models/Task.js";
import { z } from "zod";
import { createSuccessResponse } from "../models/responseMapper.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import constants from "../utils/constants.js";
import { handleValidationErrors } from "../utils/helperMethods.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const createTaskController = asyncHandler(async (req, res) => {
  try {
    const taskSchema = z.strictObject(
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
          .default("toDo"),
        icon: z.string().trim().optional().nullable(),
      },
      { error: constants.UNKNOWN_PARAMETERS }
    );

    const result = await taskSchema.parseAsync(req.body);

    const newTask = await Task.create(result);

    return res.send(createSuccessResponse(req, res, { task: newTask }));
  } catch (error) {
    handleValidationErrors(error, req.transactionId);
  }
});

export const updateTaskController = asyncHandler(async (req, res, next) => {
  try {
    const task = await Task.findById(req.params["task-id"]);

    if (!task) {
      throw new ErrorResponse(constants.RESOURCE_DOES_NOT_EXIST, 404);
    }
    const taskSchema = z.strictObject(
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
          .default("toDo")
          .optional(),
        icon: z.string().trim().optional().nullable(),
      },
      { error: constants.UNKNOWN_PARAMETERS }
    );

    const result = await taskSchema.parseAsync(req.body);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params["task-id"],
      result,
      { new: true }
    );

    return res.send(createSuccessResponse(req, res, { task: updatedTask }));
  } catch (error) {
    handleValidationErrors(error, req.transactionId);
  }
});
