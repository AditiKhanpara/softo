const express = require("express");
const router = express.Router();
const {
  createSoftoLead,
  getAllSoftoLeads,
  getSoftoLeadById,
  updateSoftoLead,
  deleteSoftoLead,
} = require("../controllers/softoLeadController");
const { authenticated } = require("../middleware/authMiddleware");

// Routes
router.post("/create", authenticated, createSoftoLead);
router.get("/getall", authenticated, getAllSoftoLeads);
router.get("/get/:id", authenticated, getSoftoLeadById);
router.put("/update/:id", authenticated, updateSoftoLead);
router.delete("/delete/:id", authenticated, deleteSoftoLead);

module.exports = router;
