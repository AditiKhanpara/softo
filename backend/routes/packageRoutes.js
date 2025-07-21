const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

// Middleware to protect routes
const authenticate = require("../middleware/auth");

router.use(authenticate); // all routes require login

router.post("/create", packageController.createPackage);
router.get("/getall", packageController.getAllPackages);
router.get("/get/:id", packageController.getPackageById);
router.put("/update/:id", packageController.updatePackage);
router.delete("/delete/:id", packageController.deletePackage);

module.exports = router;
