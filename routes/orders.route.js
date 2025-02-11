const express = require("express");
const ordersController = require("../controllers/orders.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/", auth.authMW, ordersController.getOrders);

router.post("/", auth.authMW, ordersController.addOrder);
// update order status (admin only)
router.patch("/:id", auth.authMW, auth.adminMW, ordersController.updateOrderStatus);

module.exports = router;
