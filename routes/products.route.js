const express = require("express");
const productsController = require("../controllers/products.controller");
const upload = require("../utili/multerConfig");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/", productsController.getProducts);

router.get("/:id", productsController.getProduct);

// admin/supplier only
router.post(
  "/",
  auth.authMW,
  auth.adminMW || auth.supplierMW,
  upload.single("image"),
  productsController.addProduct
);

router.patch(
  "/:id",
  auth.authMW,
  auth.adminMW || auth.supplierMW,
  upload.single("image"),
  productsController.updateProduct
);

router.delete(
  "/:id",
  auth.authMW,
  auth.adminMW || auth.supplierMW,
  productsController.deleteProduct
);

module.exports = router;
