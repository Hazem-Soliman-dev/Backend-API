const express = require("express");
const categoryController = require("../controllers/category.controller");
const auth = require("../utili/auth");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategory);

// admin only
router.post("/", auth.authMW, auth.adminMW, categoryController.createCategory);

router.patch("/:id", auth.authMW, auth.adminMW, categoryController.updateCategory);

router.delete("/:id", auth.authMW, auth.adminMW, categoryController.deleteCategory);

module.exports = router;