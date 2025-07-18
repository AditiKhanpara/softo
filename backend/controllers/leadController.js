const { Lead } = require("../models");

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const { userId, clientId } = req.user;
    const newLead = await Lead.create({
      ...req.body,
      createdBy: userId,
      createdByClient: clientId,
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to create lead", error });
  }
};

// Get all leads (optional filter by user/client)
exports.getAllLeads = async (req, res) => {
  try {
    const { userId, clientId } = req.user;
    const leads = await Lead.findAll({
      where: {
        createdBy: userId,
        createdByClient: clientId,
      },
    });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to get leads", error });
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
