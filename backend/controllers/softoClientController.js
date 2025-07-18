const { SoftoClient } = require("../models/");

// CREATE Client
exports.createClient = async (req, res) => {
  try {
    const data = req.body;

    // Set createdBy if user is a client
    if (req.user.role === "client") {
      data.createdBy = req.user.id;
    }

    const newClient = await SoftoClient.create(data);
    return res.status(201).json(newClient);
  } catch (error) {
    console.error("Create Client Error:", error);
    return res.status(500).json({ message: "Error creating client", error });
  }
};

// GET All Clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await SoftoClient.findAll();
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Fetch Clients Error:", error);
    return res.status(500).json({ message: "Error fetching clients", error });
  }
};

// GET Single Client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await SoftoClient.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.status(200).json(client);
  } catch (error) {
    console.error("Fetch Client Error:", error);
    return res.status(500).json({ message: "Error fetching client", error });
  }
};

// UPDATE Client
exports.updateClient = async (req, res) => {
  try {
    const client = await SoftoClient.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.update(req.body);
    return res.status(200).json(client);
  } catch (error) {
    console.error("Update Client Error:", error);
    return res.status(500).json({ message: "Error updating client", error });
  }
};

// DELETE Client
exports.deleteClient = async (req, res) => {
  try {
    const client = await SoftoClient.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.destroy();
    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Delete Client Error:", error);
    return res.status(500).json({ message: "Error deleting client", error });
  }
};
