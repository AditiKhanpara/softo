const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
// Define user routes

router.get("/profile", getUserProfile);

module.exports = router;
