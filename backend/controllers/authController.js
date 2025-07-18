const jwt = require("jsonwebtoken");
const { User } = require("../models");

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

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", data: {}, success: false });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Invalid credentials", data: {}, success: false });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Login failed",
      data: {},
      success: false,
    });
  }
};
