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
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    salesPersonName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salesPersonMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    discountedPrice: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    validFromDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validToDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    softoClientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "s_clients",
        key: "id",
      },
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
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
