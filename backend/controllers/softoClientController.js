const { SoftoClient, SoftoLead } = require("../models/");

exports.createSoftoClient = async (req, res) => {
  try {
    const { id, fullName, city, email, whatsappNumber, address } =
      req.body;

    // CASE 1: Convert Lead to Client
    if (id) {
      const lead = await SoftoLead.findOne({
        where: { id, createdBy: req.user.id },
      });

      if (!lead) {
        return res.status(404).json({
          message: "Lead not found",
          data: {},
          success: false,
        });
      }

      if (lead.addToClient) {
        return res.status(409).json({
          message: "Lead already converted to client",
          data: {},
          success: false,
        });
      }

      const client = await SoftoClient.create({
        fullName: lead.fullName,
        city: lead.city,
        email: lead.email,
        whatsappNumber: lead.whatsappNumber,
        address: lead.address,
        createdBy: req.user.id,
      });

      // Mark lead as converted
      lead.addToClient = true;
      await lead.save();

      return res.status(201).json({
        message: "Client created from lead successfully",
        data: client,
        success: true,
      });
    }

    // CASE 2: Direct Client Creation
    const client = await SoftoClient.create({
      fullName,
      city,
      email,
      whatsappNumber,
      address,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Client created successfully",
      data: client,
      success: true,
    });
  } catch (error) {
    console.error("Create Client Error:", error);
    return res.status(500).json({
      message: "Failed to create client",
      data: {},
      success: false,
    });
  }
};

// Get all clients
exports.getAllSoftoClients = async (req, res) => {
  try {
    const clients = await SoftoClient.findAll({
      where: { createdBy: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Clients fetched successfully",
      data: clients,
      success: true,
    });
  } catch (error) {
    console.error("Fetch Clients Error:", error);
    res.status(500).json({
      message: "Failed to fetch clients",
      data: {},
      success: false,
    });
  }
};

// Get a single client by ID
exports.getSoftoClientById = async (req, res) => {
  try {
    const client = await SoftoClient.findOne({
      where: { id: req.params.id, createdBy: req.user.id },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        data: {},
        success: false,
      });
    }

    res.status(200).json({
      message: "Client fetched successfully",
      data: client,
      success: true,
    });
  } catch (error) {
    console.error("Get Client Error:", error);
    res.status(500).json({
      message: "Failed to fetch client",
      data: {},
      success: false,
    });
  }
};

// Update a client
exports.updateSoftoClient = async (req, res) => {
  try {
    const client = await SoftoClient.findOne({
      where: { id: req.params.id, createdBy: req.user.id },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        data: {},
        success: false,
      });
    }

    await client.update(req.body);

    res.status(200).json({
      message: "Client updated successfully",
      data: client,
      success: true,
    });
  } catch (error) {
    console.error("Update Client Error:", error);
    res.status(500).json({
      message: "Failed to update client",
      data: {},
      success: false,
    });
  }
};

// Delete a client
exports.deleteSoftoClient = async (req, res) => {
  try {
    const client = await SoftoClient.findOne({
      where: { id: req.params.id, createdBy: req.user.id },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        data: {},
        success: false,
      });
    }

    await client.destroy();

    res.status(200).json({
      message: "Client deleted successfully",
      data: {},
      success: true,
    });
  } catch (error) {
    console.error("Delete Client Error:", error);
    res.status(500).json({
      message: "Failed to delete client",
      data: {},
      success: false,
    });
  }
};

exports.getSoftoClientProfile = async (req, res) => {
  try {
    const client = await SoftoClient.findOne({
      where: { id: req.user.id }, // Assuming req.user.id is the client's ID
    });

    if (!client) {
      return res.status(404).json({
        message: "Client profile not found",
        data: {},
        success: false,
      });
    }

    res.status(200).json({
      message: "Client profile fetched successfully",
      data: client,
      success: true,
    });
  } catch (error) {
    console.error("Get Client Profile Error:", error);
    res.status(500).json({
      message: "Failed to fetch client profile",
      data: {},
      success: false,
    });
  }
};
