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
      type: DataTypes.JSON, // or DataTypes.TEXT if stored as stringified JSON
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("spaceData");
        try {
          return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
        } catch (e) {
          return rawValue;
        }
      },
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
