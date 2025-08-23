import winston from "winston";
import "winston-daily-rotate-file";

/**
 * Create and configure a Winston logger instance with daily rotating file transport.
 *
 * The logger writes logs to files named with the given `filename` prefix
 * and the current date (e.g., `app-2025-08-24.log`).
 * Logs are formatted with colors (for console readability), timestamps,
 * and custom message formatting.
 *
 * @function setupLogger
 * @param {string} filename - Base name for the log file. A date suffix is appended automatically.
 * @param {"error"|"warn"|"info"|"http"|"verbose"|"debug"|"silly"} loglevel - The minimum level of messages to log.
 *
 * @returns {import("winston").Logger} Configured Winston logger instance.
 */
const setupLogger = (filename, loglevel) => {
  const transport = new winston.transports.DailyRotateFile({
    filename: `${filename}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
  });

  const logger = winston.createLogger({
    level: loglevel,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.printf((info) => `${info.timestamp} ${info.message}`)
    ),
    transports: [transport],
  });

  return logger;
};

export default setupLogger;
