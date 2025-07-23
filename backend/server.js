const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const { sequelize, createDatabase } = require("./config/db");
const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// Log HTTP requests in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    success: false,
  });
});

// ❗ Express Error Handler (must be after routes and 404)
app.use(errorHandler);

// 🚨 Global process-level error handlers
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, err);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason?.message || reason}`, reason);
});

// Start server
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await createDatabase();
    await sequelize.sync({ alter: true });
    console.log(`✅ Server running on http://localhost:${PORT}`);
  } catch (err) {
    logger.error("❌ Failed to connect to DB", err);
  }
});
