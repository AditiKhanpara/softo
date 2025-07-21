const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const leadRoutes = require("./leadRoutes");
const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");
const softoLeadRoutes = require("./softoLeadRoutes");
const softoClientRoutes = require("./softoClientRoutes");
const packageRoutes = require("./packageRoutes");
const packageDetailsRoutes = require("./packageDetailsRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/client", clientRoutes);
router.use("/softo-leads", softoLeadRoutes);
router.use("/softo-clients", softoClientRoutes);
router.use("/package", packageRoutes);
router.use("/package-details", packageDetailsRoutes);

module.exports = router;
