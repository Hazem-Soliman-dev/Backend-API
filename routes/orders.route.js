const express = require("express");
const ordersController = require("../controllers/orders.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/:id", auth.authMW, ordersController.getOrders);

router.post("/", auth.authMW, ordersController.addOrder);

router.patch("/complete/:id", auth.authMW, auth.adminMW, ordersController.completeOrder);

router.patch("/cancel/:id", auth.authMW, ordersController.cancelOrder);

module.exports = router;
