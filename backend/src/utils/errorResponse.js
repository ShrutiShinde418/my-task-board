/**
 * @class ErrorResponse
 * @extends {Error}
 *
 * Base class to be extended by all the application exceptions
 */
class ErrorResponse extends Error {
  /**
   * creates an instance of ErrorResponse
   *
   * @constructor
   * @param {String} message error message
   * @param {Number} statusCode status code of error
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
}

export default ErrorResponse;
