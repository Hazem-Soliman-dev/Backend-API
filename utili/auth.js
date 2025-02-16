const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const refreshTokens = [];

const createAccessToken = (user) =>
  jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });

const createRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(refreshToken);
  return refreshToken;
};

const authMW = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)  res.status(401).json({ error: "Access denied, token missing" });

  const token = authHeader?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Access denied, token missing" });

  try {
    req.user = await jwt.verify(token, ACCESS_SECRET);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ error: "Token has expired" });

    res.status(401).json({ error: "Invalid token" });
  }
};

const adminMW = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res
      .status(403)
      .json({ error: "Access denied, admin privileges required" });
  }
  next();
};

const supplierMW = (req, res, next) => {
  if (req.user?.role !== "Supplier") {
    return res
      .status(403)
      .json({ error: "Access denied, supplier privileges required" });
  }
  next();
};

const refreshAccessToken = async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.headers.cookie
      ?.split("; ")
      ?.find((cookie) => cookie.startsWith("refreshToken="));

  if (!refreshToken) {
    return res.status(403).json({ error: "Refresh token is missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = createAccessToken({
      id: user._id,
      role: user.role,
    });
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out successfully" });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  authMW,
  adminMW,
  supplierMW,
  refreshAccessToken,
  logout,
};
