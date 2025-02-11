const express = require("express");
const supplierController = require("../controllers/supplierDashboard.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/products/:id", auth.authMW, auth.supplierMW, supplierController.getProducts);

router.get("/orders/:id", auth.authMW, auth.supplierMW, supplierController.getOrders);

router.post("/changestatus/:id", auth.authMW, auth.supplierMW, supplierController.changeOrderStatus);

module.exports = router;
