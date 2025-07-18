const express = require("express");
const router = express.Router();
const softoClientController = require("../controllers/softoClientController");
const { authenticated } = require("../middleware/authMiddleware");

// Protect all routes
router.use(authenticated);

// Routes
router.post("/create", softoClientController.createClient);
router.get("/getall", softoClientController.getAllClients);
router.get("/get/:id", softoClientController.getClientById);
router.put("/update/:id", softoClientController.updateClient);
router.delete("/delete/:id", softoClientController.deleteClient);

module.exports = router;
