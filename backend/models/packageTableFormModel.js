const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const PackageTableForm = sequelize.define(
  "PackageTableForm",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    nos: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    width: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    length: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    square_feet: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    rs: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    total: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "squareNet",
    },
    carpentryWork: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "description",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "description",
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "description",
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "description",
    },
    type: {
      type: DataTypes.ENUM("squareNet", "description"),
      allowNull: false,
      defaultValue: "squareNet",
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
    tableName: "package_tables_form",
  }
);

module.exports = PackageTableForm;
