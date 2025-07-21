const { SoftoLead } = require("../models/");

// CREATE Lead
exports.createSoftoLead = async (req, res) => {
  try {
    const data = req.body;
    const newLead = await SoftoLead.create({ ...data, createdBy: req.user.id });
    return res.status(201).json(newLead);
  } catch (error) {
    console.error("Create Lead Error:", error);
    return res.status(500).json({ message: "Error creating lead", error });
  }
};

// GET All Leads
exports.getAllSoftoLeads = async (req, res) => {
  try {
    const leads = await SoftoLead.findAll();
    return res.status(200).json(leads);
  } catch (error) {
    console.error("Fetch Leads Error:", error);
    return res.status(500).json({ message: "Error fetching leads", error });
  }
};

// GET Single Lead by ID
exports.getSoftoLeadById = async (req, res) => {
  try {
    const lead = await SoftoLead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.status(200).json(lead);
  } catch (error) {
    console.error("Fetch Lead Error:", error);
    return res.status(500).json({ message: "Error fetching lead", error });
  }
};

// UPDATE Lead
exports.updateSoftoLead = async (req, res) => {
  try {
    const lead = await SoftoLead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.update(req.body);
    return res.status(200).json(lead);
  } catch (error) {
    console.error("Update Lead Error:", error);
    return res.status(500).json({ message: "Error updating lead", error });
  }
};

// DELETE Lead
exports.deleteSoftoLead = async (req, res) => {
  try {
    const lead = await SoftoLead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.destroy();
    return res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    return res.status(500).json({ message: "Error deleting lead", error });
  }
};
