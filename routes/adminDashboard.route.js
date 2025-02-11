const express = require("express");
const adminController = require("../controllers/adminDashboard.controller");
const auth = require("../utili/auth");

const router = express.Router();

// admin only
router.get("/users", auth.authMW, auth.adminMW, adminController.getUsers);
router.get("/products", auth.authMW, auth.adminMW, adminController.getProducts);
router.get("/orders", auth.authMW, auth.adminMW, adminController.getOrders);
router.get("/analytics", auth.authMW, auth.adminMW, adminController.getAnalytics);

module.exports = router;