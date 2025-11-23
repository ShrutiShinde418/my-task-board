import { v4 } from "uuid";

/**
 * Middleware to initialize a new transaction for each incoming request.
 *
 * Generates a unique transaction ID (`uuid.v4`) and attaches it to the request object
 * along with the request start time. This helps with request tracking, logging,
 * and performance monitoring.
 *
 * @function startTransaction
 * @param {Object} req - Express request object, extended with:
 *   @property {string} transactionID - Unique identifier for the request lifecycle.
 *   @property {number} txnStart - Timestamp (in ms) when the request started.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 *
 * @returns {void} Calls `next()` to continue request processing.
 */
const startTransaction = (req, res, next) => {
  req.transactionID = v4();
  req.txnStart = Date.now();

  next();
};

export default startTransaction;
