const express = require("express");
const authController = require("../controllers/auth.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh", auth.refreshAccessToken);

router.post("/logout", auth.logout);

module.exports = router;
