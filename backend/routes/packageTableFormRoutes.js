const express = require("express");
const router = express.Router();
const {
  createPackageTableEntry,
  getPackageTableEntry,
  getAllPackageTableEntries,
  updatePackageTableEntry,
  deletePackageTableEntry,
} = require("../controllers/packageTableFormController");
const { authenticated } = require("../middleware/authMiddleware");

// Routes
router.post("/create", authenticated, createPackageTableEntry);
router.get("/getall", authenticated, getPackageTableEntry);
router.get("/get/:id", authenticated, getAllPackageTableEntries);
router.put("/update/:id", authenticated, updatePackageTableEntry);
router.delete("/delete/:id", authenticated, deletePackageTableEntry);

module.exports = router;
