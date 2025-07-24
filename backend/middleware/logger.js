const { createLogger, format, transports } = require("winston");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  const upperLevel = level.toUpperCase();

  if (stack) {
    return [
      `┌─[${upperLevel}] ${timestamp}`,
      `│ Message: ${message}`,
      `│`,
      `│ Stack Trace:`,
      ...stack.split("\n").map((line) => `│   ${line}`),
      `└──────────────────────────────`,
    ].join("\n");
  }

  return `[${upperLevel}] ${timestamp} - ${message}`;
});


const logger = createLogger({
  level: isProd ? "error" : "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // capture stack
    logFormat
  ),
  transports: isProd
    ? [
        new transports.File({ filename: path.join(__dirname, "../logs/error.log"), level: "error" }),
        new transports.File({ filename: path.join(__dirname, "../logs/combined.log") }),
      ]
    : [new transports.Console()],
});

module.exports = { logger };
