const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { authenticated } = require("../middleware/authMiddleware");

// Protect all routes

// Routes
router.post("/create", authenticated, clientController.createClient);
router.get("/getall", authenticated, clientController.getAllClients);
router.get("/get/:id", authenticated, clientController.getClientById);
router.put("/update/:id", authenticated, clientController.updateClient);
router.delete("/delete/:id", authenticated, clientController.deleteClient);
router.delete("/profile/me", authenticated, clientController.getClientProfile);

module.exports = router;
