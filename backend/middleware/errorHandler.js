const { logger } = require("./logger");

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const msg = `[${req.method}] ${req.originalUrl} - ${err.message}`;

  logger.error(msg, err); 

  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && status === 500
        ? "Something went wrong."
        : err.message,
  });
};

module.exports = { AppError, errorHandler };
