const express = require("express");
const router = express.Router();
const {
  createPackageDetail,
  getAllPackageDetails,
  getPackageDetailById,
  getPackageDetailById,
  deletePackageDetail,
} = require("../controllers/packageTableController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/create", authenticated, createPackageDetail);
router.get("/getall", authenticated, getAllPackageDetails);
router.get("/get/:id", authenticated, getPackageDetailById);
router.put("/update/:id", authenticated, getPackageDetailById);
router.delete("/delete/:id", authenticated, deletePackageDetail);

module.exports = router;
