const express = require("express");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/:id", cartController.getCart);

router.post("/:id", cartController.addToCart);

// Update product quantity in cart
router.patch("/:id", cartController.updateCart);

router.delete("/:id", cartController.removeFromCart);

router.delete("/clear/:id", cartController.clearCart);

module.exports = router;
