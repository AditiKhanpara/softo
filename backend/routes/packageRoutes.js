const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

const { authenticate } = require("../middleware/authMiddleware");

router.post("/create", authenticate, packageController.createPackage);
router.get("/getall", authenticate, packageController.getAllPackages);
router.get("/get/:id", authenticate, packageController.getPackageById);
router.put("/update/:id", authenticate, packageController.updatePackage);
router.delete("/delete/:id", authenticate, packageController.deletePackage);

module.exports = router;
