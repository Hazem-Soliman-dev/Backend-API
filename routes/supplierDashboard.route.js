const express = require("express");

const router = express.Router();

router.get("/products", (req, res) => {
  res.json("Supplier products");
});

router.get("/orders", (req, res) => {
  res.json("Supplier orders");
});

module.exports = router;
