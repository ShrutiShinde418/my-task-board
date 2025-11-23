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
   * @param {Number} code status code of error
   */
  constructor(message, code) {
    super();
    this.code = code;
    this.message = message;

    Error.captureStackTrace(this);
  }
}

export default ErrorResponse;
