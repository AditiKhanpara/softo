const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "packages",
  }
);

module.exports = Package;
