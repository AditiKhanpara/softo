const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/create", authenticated, createLead);
router.get("/getall", authenticated, getAllLeads);
router.get("/get/:id", authenticated, getLeadById);
router.put("/update/:id", authenticated, updateLead);
router.delete("/delete/:id", authenticated, deleteLead);

module.exports = router;
