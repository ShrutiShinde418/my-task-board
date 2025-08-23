/**
 * asyncHandler
 *
 * This higher order function helps in catching errors in async express routes and passing it to next() allowing for better error handling
 *
 * @param {Function} fn
 *
 * @returns {(req: Object, res: Object, next: Object) => void}
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
