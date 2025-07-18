const express = require("express");
const router = express.Router();
const softoLeadController = require("../controllers/softoLeadController");
const { authenticated } = require("../middleware/authMiddleware");

// Protect all routes
router.use(authenticated);

// Routes
router.post("/create", softoLeadController.createLead);
router.get("/getall", softoLeadController.getAllLeads);
router.get("/get/:id", softoLeadController.getLeadById);
router.put("/update/:id", softoLeadController.updateLead);
router.delete("/delete/:id", softoLeadController.deleteLead);

module.exports = router;
