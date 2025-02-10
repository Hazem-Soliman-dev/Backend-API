const express = require("express");
const adminController = require("../controllers/adminDashboard.controller");

const router = express.Router();

// admin only
router.get("/users", adminController.getUsers);
router.get("/products", adminController.getProducts);
router.get("/orders", adminController.getOrders);
router.get("/analytics", adminController.getAnalytics);

module.exports = router;