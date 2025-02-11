const express = require("express");
const cartController = require("../controllers/cart.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/:id", auth.authMW, cartController.getCart);

router.post("/:id", auth.authMW, cartController.addToCart);
// Update product quantity in cart
router.patch("/:id", auth.authMW, cartController.updateCart);

router.delete("/:id", auth.authMW, cartController.removeFromCart);

router.delete("/clear/:id", auth.authMW, cartController.clearCart);

module.exports = router;
