import crypto from "node:crypto";
import { promisify } from "node:util";
import { ZodError } from "zod";
import ErrorResponse from "./errorResponse.js";
import constants from "./constants.js";

const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * Derives a 256-bit AES key from a password and salt using PBKDF2.
 */
const deriveKey = async (password, salt) => {
  return await pbkdf2(password, salt, 10000, 32, "sha256");
};

/**
 * Encrypts data using AES-256-GCM.
 */
export const encryptData = async function (data, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = await deriveKey(password, salt);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, authTag, ciphertext]).toString("base64");
};

/**
 * Decrypts data using AES-256-GCM.
 */
export const decryptData = async function (encryptedString, password) {
  const combined = Buffer.from(encryptedString, "base64");

  const salt = combined.subarray(0, 16);
  const iv = combined.subarray(16, 28);
  const authTag = combined.subarray(28, 44);
  const ciphertext = combined.subarray(44);

  const key = await deriveKey(password, salt);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

/**
 * Handle and normalize validation errors.
 *
 * - If the error is already an `ErrorResponse`, it is re-thrown as-is.
 * - If the error is a `ZodError`, its issues are collected and returned
 *   as a new `ErrorResponse` with status 422.
 * - For all other errors, a generic `INTERNAL_COMMUNICATION_EXCEPTION`
 *   response is thrown with status 500.
 *
 * @function handleValidationErrors
 * @param {Error|import("zod").ZodError|ErrorResponse} error - The error thrown during validation or execution.
 * @param {string} transactionID - Unique transaction identifier for tracking/logging.
 *
 * @throws {ErrorResponse} Normalized error response depending on error type.
 */
export const handleValidationErrors = (error, transactionID) => {
  logger.error(`${transactionID} Inside handleValidationErrors method`);

  if (error.name === "ErrorResponse") {
    throw error;
  }

  const messages = [];
  if (error instanceof ZodError) {
    for (let err of error.issues) {
      messages.push(err.message);
    }
    logger.error(`${transactionID} Error messages :: ${messages}`);

    throw new ErrorResponse(messages.join(", "), 422);
  } else {
    throw new ErrorResponse(constants.INTERNAL_COMMUNICATION_EXCEPTION, 500);
  }
};
