const Category = require("../models/category.model");
const mongoose = require("mongoose");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" }).lean().exec();
    if (!categories.length) return res.status(404).json({ error: "Categories not found" });

    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid category ID" });

  try {
    const category = await Category.findById(id).lean().exec();
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  try {
    const category = await Category.create({ name, description });
    res.status(201).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name)
    return res.status(400).json({ error: "Category name is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid category ID" });

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid category ID" });

  try {
    const result = await Category.updateOne({ _id: id }, { status: "deleted" });
    if (result.nModified === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(200).json({ message: `Category ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

