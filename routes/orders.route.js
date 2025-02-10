const express = require("express");
const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.post("/", ordersController.addOrder);
// update order status (admin only)
router.patch("/:id", ordersController.updateOrderStatus);

module.exports = router;
