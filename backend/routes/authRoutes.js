const express = require("express");
const router = express.Router();
const {
  register,
  login,
  loginClient,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/login-client", loginClient);

module.exports = router;
