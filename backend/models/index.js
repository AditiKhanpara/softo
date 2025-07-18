const User = require("./userModel");
const Lead = require("./leadModel");
const Client = require("./clientModel");
const rolePermission = require("./rolePermissionModel");
const SoftoClient = require("./softoClientModel");
const SoftoLead = require("./softoLeadModel");

// User relationships
User.hasMany(Lead, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
User.hasMany(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Lead relationships
Lead.belongsTo(User, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Client relationships
Client.belongsTo(User, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Client.hasMany(SoftoClient, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.hasMany(SoftoLead, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// softoClient relationships
SoftoClient.belongsTo(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// softoLead relationships
SoftoLead.belongsTo(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

module.exports = {
  User,
  Lead,
  Client,
  rolePermission,
  SoftoClient,
  SoftoLead,
};
