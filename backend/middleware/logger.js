const { createLogger, format, transports } = require("winston");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

// Clean log formatter
const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  const line = "─".repeat(50); // cleaner than just '-'
  const tag = level.toUpperCase().padEnd(5); // pad for consistent alignment

  return `${line}
[${tag}] ${timestamp}
message: ${message}
${stack ? `↪ Stack:\n${stack}` : ""}
${line}\n`;
});

const logger = createLogger({
  level: isProd ? "error" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [],
});

// 📁 Only log to files in production
if (isProd) {
  logger.add(
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    })
  );
  logger.add(
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    })
  );
} else {
  // 💻 Only log to console in development
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormat
      ),
    })
  );
}

module.exports = { logger };
