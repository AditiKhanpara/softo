const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

const { authenticated } = require("../middleware/authMiddleware");

router.post("/create", authenticated, packageController.createPackage);
router.get("/getall", authenticated, packageController.getAllPackages);
router.get("/get/:id", authenticated, packageController.getPackageById);
router.put("/update/:id", authenticated, packageController.updatePackage);
router.delete("/delete/:id", authenticated, packageController.deletePackage);

module.exports = router;
