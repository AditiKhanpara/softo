const jwt = require("jsonwebtoken");
const { User } = require("../models/");

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

    const user = await User.findByPk(decoded.userId, {
      attributes: ["id", "username", "email"], // limit info
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", data: {}, success: false });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token", data: {}, success: false });
  }
};

module.exports = authenticated;
