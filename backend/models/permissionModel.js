// models/permissionModel.js
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,   // e.g. 'create', 'read', 'update', 'delete'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,   // e.g. 'lead', 'client', 'user'
    },
  },
  {
    tableName: 'permissions',
    timestamps: false,
  }
);

module.exports = Permission;
