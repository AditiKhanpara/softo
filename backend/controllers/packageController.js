const Package = require("../models/Package");

// Create a new package
const createPackage = async (req, res) => {
  try {
    const { name } = req.body;
    const createdBy = req.user.id;

    const newPackage = await Package.create({ name, createdBy });

    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const pkg = await Package.findByPk(id);

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Optional: check if the user updating is the creator
    // if (pkg.createdBy !== req.user.id) {
    //   return res.status(403).json({ error: "Not authorized to update this package" });
    // }

    pkg.name = name || pkg.name;

    await pkg.save();

    res.status(200).json(pkg);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByPk(id);

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Optional: check if the user deleting is the creator
    // if (pkg.createdBy !== req.user.id) {
    //   return res.status(403).json({ error: "Not authorized to delete this package" });
    // }

    await pkg.destroy();

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
