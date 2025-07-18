const jwt = require("jsonwebtoken");
const { User, Client } = require("../models/");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided", data: {}, success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let userOrClient = null;

    if (decoded.userId) {
      userOrClient = await User.findByPk(decoded.userId);
      if (userOrClient) req.user = userOrClient;
    } else if (decoded.clientId) {
      userOrClient = await Client.findByPk(decoded.clientId);
      if (userOrClient) req.user = userOrClient;
    }

    if (!userOrClient) {
      return res
        .status(404)
        .json({ message: "User/Client not found", data: {}, success: false });
    }

    next();
  } catch (err) {
    console.error("Token Error:", err);
    return res.status(403).json({
      message: "Invalid or expired token",
      data: {},
      success: false,
    });
  }
};

module.exports = { authenticated };
