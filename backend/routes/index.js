const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const leadRoutes = require("./leadRoutes");
const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/client", clientRoutes);

module.exports = router;
