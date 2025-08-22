import winston from "winston";
import "winston-daily-rotate-file";

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
