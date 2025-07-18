const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/create", userController.createUser);
router.get("/getall", userController.getAllUsers);
router.get("/get/:id", userController.getUserById);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

// ✅ Protected route to get own profile
router.get("/profile/me", authenticated, userController.getUserProfile);

module.exports = router;
