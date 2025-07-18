const { SoftoLead } = require("../models/");

// CREATE Lead
exports.createLead = async (req, res) => {
  try {
    const data = req.body;

    // Set createdBy if user is a client
    if (req.user.role === "client") {
      data.createdBy = req.user.id;
    }

    const newLead = await SoftoLead.create(data);
    return res.status(201).json(newLead);
  } catch (error) {
    console.error("Create Lead Error:", error);
    return res.status(500).json({ message: "Error creating lead", error });
  }
};

// GET All Leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await SoftoLead.findAll();
    return res.status(200).json(leads);
  } catch (error) {
    console.error("Fetch Leads Error:", error);
    return res.status(500).json({ message: "Error fetching leads", error });
  }
};

// GET Single Lead by ID
exports.getLeadById = async (req, res) => {
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
exports.updateLead = async (req, res) => {
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
exports.deleteLead = async (req, res) => {
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
