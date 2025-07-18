const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const leadRoutes = require("./leadRoutes");

router.use("/users", userRoutes);
router.use("/leads", leadRoutes);

module.exports = router;
