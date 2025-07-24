const { AppError } = require("../middleware/errorHandler");
const { logger } = require("../middleware/logger");
const { Quotation, Package, Client, SoftoClient } = require("../models");
const PdfPrinter = require("pdfmake");

// CREATE
exports.createQuotation = async (req, res, next) => {
  logger.info("🟢 User registration started");
  try {
    const {
      name,
      projectName,
      projectCode,
      area,
      amount,
      salesPersonName,
      salesPersonMobile,
      discount,
      validFromDate,
      validToDate,
      softoClientId,
      packageId, 
    } = req.body;

    const createdBy = req.user.id;

    // ✅ Validation
    if (!name || !softoClientId || !packageId) {
      throw new AppError(
        "name, softoClientId, and packageId are required",
        400
      );
    }

    // ✅ Validate package ownership
    const pkg = await Package.findOne({
      where: { id: packageId, createdBy },
    });

    if (!pkg) {
      throw new AppError("Invalid or unauthorized packageId", 403);
    }

    // ✅ Discount calculation
    let discountedPrice = amount;
    if (amount && discount) {
      discountedPrice = amount - discount;
    }

    // ✅ Create quotation
    const quotation = await Quotation.create({
      name,
      projectName,
      projectCode,
      area,
      amount,
      salesPersonName,
      salesPersonMobile,
      discount,
      discountedPrice,
      validFromDate,
      validToDate,
      softoClientId,
      packageId,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      data: quotation,
      message: "Quotation created successfully",
    });
  } catch (err) {
    next(err); // 🔥 send to errorHandler.js
  }
};

// GET ALL
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      where: { createdBy: req.user.id },
      include: [{ model: Package }, { model: Client }, { model: SoftoClient }],
    });
    return res.status(200).json({
      success: true,
      data: quotations,
      message: "Quotations fetched successfully",
    });
  } catch (error) {
    console.error("Fetch Quotations Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findOne({
      where: { id, createdBy: req.user.id },
      include: [{ model: Package }, { model: Client }, { model: SoftoClient }],
    });

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    return res.status(200).json({
      success: true,
      data: quotation,
      message: "Quotation fetched successfully",
    });
  } catch (error) {
    console.error("Fetch Quotation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.user.id;

    // 🔒 Find quotation and ensure it belongs to the user
    const quotation = await Quotation.findOne({
      where: { id, createdBy },
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized",
      });
    }

    // ✅ Destructure and allow only updatable fields
    const {
      name,
      projectName,
      projectCode,
      area,
      amount,
      salesPersonName,
      salesPersonMobile,
      discount,
      validFromDate,
      validToDate,
      softoClientId,
      packageId,
    } = req.body;

    // Optional: validate new packageId belongs to user (if updated)
    if (packageId && packageId !== quotation.packageId) {
      const pkg = await Package.findOne({
        where: { id: packageId, createdBy },
      });

      if (!pkg) {
        return res.status(403).json({
          success: false,
          message: "Invalid or unauthorized packageId",
        });
      }
    }

    // ✅ Auto-calculate discountedPrice if amount or discount changed
    const finalAmount = amount ?? quotation.amount;
    const finalDiscount = discount ?? quotation.discount;
    const discountedPrice =
      finalAmount && finalDiscount
        ? finalAmount - finalDiscount
        : quotation.discountedPrice;

    // ✅ Perform the update
    await quotation.update({
      name: name ?? quotation.name,
      projectName: projectName ?? quotation.projectName,
      projectCode: projectCode ?? quotation.projectCode,
      area: area ?? quotation.area,
      amount: finalAmount,
      salesPersonName: salesPersonName ?? quotation.salesPersonName,
      salesPersonMobile: salesPersonMobile ?? quotation.salesPersonMobile,
      discount: finalDiscount,
      discountedPrice,
      validFromDate: validFromDate ?? quotation.validFromDate,
      validToDate: validToDate ?? quotation.validToDate,
      softoClientId: softoClientId ?? quotation.softoClientId,
      packageId: packageId ?? quotation.packageId,
    });

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
      data: quotation,
    });
  } catch (error) {
    console.error("Update Quotation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findOne({
      where: { id, createdBy: req.user.id },
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized",
      });
    }

    await quotation.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Quotation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fonts = {
  Roboto: {
    normal: Buffer.from([]), // empty or inlined base64 font (not ideal)
  },
};

const printer = new PdfPrinter(fonts);

// createQuotation pdf
exports.createQuotationPdf = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "PDF created successfully" });
  } catch (error) {
    console.error("Create Quotation PDF Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
