const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "endsecure_softo_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: true,
});

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database "${DB_NAME}" is ready.`);
    await connection.end();

    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    return sequelize;
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw err;
  }
};

module.exports = { sequelize, createDatabase };
