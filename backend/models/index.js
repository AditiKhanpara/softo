const User = require("./userModel");
const Lead = require("./leadModel");
const Client = require("./clientModel");
const rolePermission = require("./rolePermissionModel");

// user
User.hasMany(Lead, { foreignKey: "createdBy", as: "createdBy" });
User.hasMany(Lead, { foreignKey: "createdByClient", as: "createdByClient" });
User.hasMany(rolePermission, { foreignKey: "userId", as: "rolePermissions" });

// lead
Lead.belongsTo(User, { foreignKey: "createdBy", as: "user" });
Lead.belongsTo(Client, { foreignKey: "createdByClient", as: "client" });

// client
Client.hasMany(Lead, { foreignKey: "createdByClient", as: "createdByClient" });
Client.hasMany(rolePermission, { foreignKey: "clientId", as: "rolePermissions" });

module.exports = {
  User,
  Lead,
};
