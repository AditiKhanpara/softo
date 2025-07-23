// middlewares/errorHandler.js
const path = require("path");
const { logger } = require("../middleware/logger");

// ✅ Custom Error for clean throwing
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ✅ Helper: extract origin file/line from stack
const extractOrigin = (err) => {
  const stackLine = (err.stack || "").split("\n")[1];
  const match = stackLine?.match(/\((.*):(\d+):(\d+)\)/);
  if (match) {
    const [, fullPath, line, column] = match;
    const fileName = path.basename(fullPath);
    return `${fileName}:${line}:${column}`;
  }
  return "unknown";
};

// ✅ Express error middleware
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const origin = extractOrigin(err);

  // Log it using Winston
  logger.error(`[${req.method}] ${req.originalUrl} -> ${err.message}\n↪ Origin: ${origin}`, err);

  // Send safe response to client
  res.status(status).json({
    success: false,
    message:
      status === 500 && process.env.NODE_ENV === "production"
        ? "Something went wrong, please try again later."
        : err.message,
  });
};

module.exports = { errorHandler, AppError };
