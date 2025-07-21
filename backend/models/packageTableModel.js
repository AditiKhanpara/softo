const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const PackageTable = sequelize.define(
  "PackageTable",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
    },
    spaceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spaceData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    spaceType: {
      type: DataTypes.ENUM("squareNet", "description"),
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
    tableName: "package_detail",
  }
);

module.exports = PackageTable;
