const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const leadRoutes = require("./leadRoutes");
const authRoutes = require("./authRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);

module.exports = router;
