const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  createQuotationPdf,
} = require("../controllers/quotationController");
const { authenticated } = require("../middleware/authMiddleware");

// middleware: authenticate user and attach req.user.id

router.post("/create", authenticated, createQuotation);
router.get("/getall", authenticated, getAllQuotations);
router.get("/get/:id", authenticated, getQuotationById);
router.put("/update/:id", authenticated, updateQuotation);
router.delete("/delete/:id", authenticated, deleteQuotation);
router.post("/create/pdf", authenticated, createQuotationPdf);

module.exports = router;
