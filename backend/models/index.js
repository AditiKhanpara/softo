const User = require("./userModel");
const Lead = require("./leadModel");
const Client = require("./clientModel");
const rolePermission = require("./rolePermissionModel");
const SoftoClient = require("./softoClientModel");
const SoftoLead = require("./softoLeadModel");
const Quotation = require("./quotationModel");
const Package = require("./packageModel");
const PackageTableForm = require("./packageTableFormModel");
const PackageTable = require("./packageTableModel");

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
Client.hasMany(Quotation, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.hasMany(Package, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.hasMany(PackageTableForm, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.hasMany(PackageTable, {
  foreignKey: { name: "createdBy" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.hasMany(Quotation, {
  foreignKey: { name: "clientId" },
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

// quotation
Quotation.belongsTo(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// package
Package.belongsTo(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Package.hasMany(PackageTableForm, {
  foreignKey: { name: "packageId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Package.hasMany(Quotation, {
  foreignKey: { name: "packageId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// packageTable
PackageTable.belongsTo(Package, {
  foreignKey: { name: "packageId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PackageTable.belongsTo(Client, {
  foreignKey: { name: "createdBy" },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// quotation relationships
Quotation.belongsTo(SoftoClient, {
  foreignKey: { name: "softoClientId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Quotation.belongsTo(Package, {
  foreignKey: { name: "packageId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Quotation.belongsTo(Client, {
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
  Quotation,
  Package,
  PackageTableForm,
  PackageTable,
};
