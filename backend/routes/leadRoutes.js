const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
// const authenticate = require("../middleware/authenticate"); // ensure req.user is set

// router.use(authenticate);

router.post("/create", createLead);
router.get("/getall", getAllLeads);
router.get("/get/:id", getLeadById);
router.put("/update/:id", updateLead);
router.delete("/delete/:id", deleteLead);

module.exports = router;
