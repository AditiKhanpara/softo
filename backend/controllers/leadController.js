const { Lead } = require("../models");

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const { id } = req.user;
    const newLead = await Lead.create({
      ...req.body,
      createdBy: id,
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to create lead", error });
  }
};

// Get all leads (optional filter by user/client)
exports.getAllLeads = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in request",
        data: {},
      });
    }

    const leads = await Lead.findAll({
      where: {
        createdBy: id,
        addToClient: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get leads",
      data: {},
    });
  }
};

// Get single lead
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lead", error });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.update(req.body);
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update lead", error });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.destroy();
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lead", error });
  }
};
