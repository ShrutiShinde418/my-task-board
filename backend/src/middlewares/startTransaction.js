import { v4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();

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
  asyncLocalStorage.run(new Map(), () => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.set('transactionID', v4());
      store.set('txnStart', Date.now());
    }
    next();
  });
};

/**
 * Get transactionId and txnStart from the async store
 *
 * @returns {{transactionId: string, txnStart: number} | undefined}
 */
export const getTransactionIdFromAsyncStore = () => {
  const store = asyncLocalStorage.getStore();
  return store ? store.get('transactionID') : undefined;
}

export const getTxnStartFromAsyncStore = () => {
  const store = asyncLocalStorage.getStore();
  return store ? store.get('txnStart') : undefined;
}

export default startTransaction;
