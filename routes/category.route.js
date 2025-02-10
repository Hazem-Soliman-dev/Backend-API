const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategory);

// admin only
router.post("/", categoryController.createCategory);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;