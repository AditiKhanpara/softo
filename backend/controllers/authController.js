const jwt = require("jsonwebtoken");
const { User, Client } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use .env in production

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        message: "Email already registered",
        data: {},
        success: false,
      });
    }

    const user = await User.create({ username, email, password });
    return res.status(201).json({
      message: "User registered successfully",
      data: { id: user.id, username: user.username, email: user.email },
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Registration failed",
      data: {},
      success: false,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check in User table
    const user = await User.findOne({ where: { email } });

    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
          data: {},
          success: false,
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "User login successful",
        data: { token },
        success: true,
      });
    }

    // If not found in User, check in Client table
    const client = await Client.findOne({ where: { email } });

    if (client) {
      const isMatch = await client.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
          data: {},
          success: false,
        });
      }

      const token = jwt.sign({ clientId: client.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Client login successful",
        data: { token },
        success: true,
      });
    }

    // If neither User nor Client found
    return res.status(404).json({
      message: "User or Client not found",
      data: {},
      success: false,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      message: "Login failed",
      data: {},
      success: false,
    });
  }
};
