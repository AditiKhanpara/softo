const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { sequelize, createDatabase } = require("./config/db");
const routes = require("./routes");
// const errorMiddleware = require("./middlewares/errorMiddleware");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan("dev"));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);
// app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await createDatabase();
    await sequelize.sync({ alter: true });
    console.log(`✅ Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
  }
});
