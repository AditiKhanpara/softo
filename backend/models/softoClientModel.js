const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const SoftoClient = sequelize.define(
  "SoftoClient",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: "clients",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "s_clients",
  }
);

module.exports = SoftoClient;
