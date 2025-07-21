const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    },
    clientId: {
      type: DataTypes.UUID,
      references: {
        model: "clients",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "permissions",
  }
);

module.exports = Permission;
