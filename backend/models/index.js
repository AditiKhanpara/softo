const User = require("./userModel");
const Lead = require("./leadModel");
const Client = require("./clientModel");
const rolePermission = require("./rolePermissionModel");

// user associations
User.hasMany(Lead, { foreignKey: "createdBy", as: "createdLeads" });
User.hasMany(Client, { foreignKey: "createdBy", as: "createdClients" });
User.hasMany(rolePermission, { foreignKey: "userId", as: "rolePermissions" });

// lead associations
Lead.belongsTo(User, { foreignKey: "createdBy", as: "user" });
Lead.belongsTo(Client, { foreignKey: "createdByClient", as: "client" });

// client to lead
Client.hasMany(Lead, { foreignKey: "createdByClient", as: "createdLeads" });

// self-referencing client relationships
Client.hasMany(Client, {
  foreignKey: "createdByClient",
  as: "subClients", // Clients created by this client
});
Client.belongsTo(Client, {
  foreignKey: "createdByClient",
  as: "parentClient", // The parent creator client
});

// client to permission
Client.hasMany(rolePermission, {
  foreignKey: "clientId",
  as: "rolePermissions",
});

module.exports = {
  User,
  Lead,
  Client,
  rolePermission,
};
