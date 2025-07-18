const User = require("./userModel");
const Lead = require("./leadModel");
const Client = require("./clientModel");
const rolePermission = require("./rolePermissionModel");

// User relationships
User.hasMany(Lead, { foreignKey: "createdBy" });
User.hasMany(Client, { foreignKey: "createdBy" });

// Lead relationships
Lead.belongsTo(User, { foreignKey: "createdBy" });

// Client relationships
Client.belongsTo(User, { foreignKey: "createdBy" });

module.exports = {
  User,
  Lead,
  Client,
  rolePermission,
};
