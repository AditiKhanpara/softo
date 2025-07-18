const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Client = sequelize.define(
  "Client",
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
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "clients",
    hooks: {
      beforeCreate: async (client) => {
        if (client.password) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
      beforeUpdate: async (client) => {
        if (client.changed("password")) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
    },
  }
);

// Instance method to compare passwords
Client.prototype.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = Client;
