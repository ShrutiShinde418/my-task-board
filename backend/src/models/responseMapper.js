/**
 * Create a standardized error response object.
 *
 * Sets the HTTP status code on the response and returns a JSON payload
 * containing the error details.
 *
 * @function createErrorResponse
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {Error|object|string} exception - The error or exception to include in the response.
 * @param {number} statusCode - HTTP status code to send in the response.
 *
 * @returns {{ success: boolean, error: any }} Standardized error response object.
 */
export const createErrorResponse = (req, res, exception, statusCode) => {
  if (exception.name === "ErrorResponse") delete exception.name;

  const data = {
    success: false,
    error: exception,
  };

  res.status(statusCode);

  return data;
};

/**
 * Create a standardized success response object.
 *
 * Sets HTTP status 200 on the response and returns a JSON payload
 * containing the requested data.
 *
 * @function createSuccessResponse
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {object} data - The data payload to return in the response.
 *
 * @returns {{ success: boolean, data: any }} Standardized success response object.
 */
export const createSuccessResponse = (req, res, data) => {
  const response = {
    success: true,
    ...data,
  };

  res.status(200);

  return response;
};
