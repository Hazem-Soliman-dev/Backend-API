const express = require("express");
const productsController = require("../controllers/products.controller");
const upload = require("../utili/multerConfig");

const router = express.Router();

router.get("/", productsController.getProducts);

router.get("/:id", productsController.getProduct);

// admin/supplier only
router.post("/", upload.single("image"), productsController.addProduct);

// admin/supplier only
router.patch("/:id", upload.single("image"), productsController.updateProduct);

// admin/supplier only - soft delete
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
