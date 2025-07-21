const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Quotation = sequelize.define(
  "Quotation",
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
    tableName: "quotations",
  }
);

module.exports = Quotation;
