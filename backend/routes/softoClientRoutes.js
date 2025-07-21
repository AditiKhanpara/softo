const express = require("express");
const router = express.Router();
const {
  createSoftoClient,
  getAllSoftoClients,
  getSoftoClientById,
  updateSoftoClient,
  deleteSoftoClient,
} = require("../controllers/softoClientController");
const { authenticated } = require("../middleware/authMiddleware");

// Routes
router.post("/create", authenticated, createSoftoClient);
router.get("/getall", authenticated, getAllSoftoClients);
router.get("/get/:id", authenticated, getSoftoClientById);
router.put("/update/:id", authenticated, updateSoftoClient);
router.delete("/delete/:id", authenticated, deleteSoftoClient);

module.exports = router;
