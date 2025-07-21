const { PackageTable, Package } = require("../models");

// CREATE a new package detail
exports.createPackageDetail = async (req, res) => {
  try {
    const { packageId, ...otherFields } = req.body;
    const createdBy = req.user.id;

    // Optional: validate packageId belongs to this user
    const pkg = await Package.findOne({
      where: { id: packageId, createdBy },
    });

    if (!pkg) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized package ID" });
    }

    const newDetail = await PackageTable.create({
      ...otherFields,
      packageId,
      createdBy,
    });

    return res.status(201).json({ success: true, data: newDetail });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// READ all package details (only user's, with included Package info)
exports.getAllPackageDetails = async (req, res) => {
  const { packageId } = req.query; // ← Use query, not params

  try {
    const whereClause = {
      createdBy: req.user.id,
    };

    if (packageId) {
      whereClause.packageId = packageId;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Package ID is required" });
    }

    const details = await PackageTable.findAll({
      where: whereClause,
      include: [{ model: Package }],
    });

    return res.status(200).json({ success: true, data: details });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// READ a single package detail by ID (only if owned, with Package)
exports.getPackageDetailById = async (req, res) => {
  const { id } = req.params.id;
  try {
    const detail = await PackageTable.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id,
        packageId: id,
      },
      include: [{ model: Package }],
    });

    if (!detail) {
      return res
        .status(404)
        .json({ success: false, message: "Package detail not found" });
    }

    return res.status(200).json({ success: true, data: detail });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE a package detail by ID
exports.updatePackageDetail = async (req, res) => {
  try {
    const detail = await PackageTable.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id,
      },
    });

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Package detail not found or unauthorized",
      });
    }

    await detail.update(req.body);
    return res.status(200).json({ success: true, data: detail });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a package detail by ID
exports.deletePackageDetail = async (req, res) => {
  try {
    const detail = await PackageTable.findOne({
      where: {
        id: req.params.id,
        createdBy: req.user.id,
      },
    });

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Package detail not found or unauthorized",
      });
    }

    await detail.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
