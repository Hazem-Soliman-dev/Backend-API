const Product = require("../models/product.model");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  // Validate query parameters and pagination parameters
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    ...query
  } = req.query;
  const skip = (page - 1) * limit;

  // Find all products and return active products only, just page by page
  try {
    const products = await Product.find(
      { $and: [query, { status: "active" }] },
      null,
      { sort: { [sortBy]: order === "asc" ? 1 : -1 }, lean: true }
    )
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    if (!products.length)
      return res.status(404).json({ error: "Products not found" });

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  // Validate product ID
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid product ID" });

  // Find product by ID and return products without deleted products
  try {
    const product = await Product.findOne({
      _id: id,
      status: { $ne: "deleted" },
    })
      .lean()
      .exec();
    return product
      ? res.json({ data: product })
      : res.status(404).json({ error: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  // Validate request body
  const { name, category, price, quantity = 1, supplier } = req.body;
  if (!name || !category || !price || !supplier) {
    return res.status(400).json({
      error: "Missing required fields",
      message:
        "The following fields are required and cannot be empty: name, category, price",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(category))
    return res.status(400).json({ error: "Invalid category ID" });

  // Create new product
  try {
    const product = await Product.create({
      ...req.body,
      image: req.file.filename,
    });
    if (!product)
      return res.status(500).json({ error: "Failed to add product" });

    return res
      .status(201)
      .json({ message: "Product added successfully", data: product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid product ID" });

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Remove old image if it exists
    if (product.image && req.file) {
      const oldImagePath = `images/${product.image}`;
      fs.unlinkSync(oldImagePath);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { ...req.body, ...(req.file && { image: req.file.filename }) } },
      {
        runValidators: true,
        new: true,
        lean: true,
        fields: Object.keys(req.body),
        Projection: { _id: 0 },
      }
    );

    res.status(200).json({
      message: `Product ${id} updated successfully`,
      updated: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: "Invalid product ID" });

  try {
    const product = await Product.findOne({ _id: id });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const imagePath = path.join(__dirname, '../images', product.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const result = await Product.updateOne(
      { _id: id, status: { $ne: "deleted" } },
      { status: "deleted" }
    );
    if (result.nModified === 0)
      return res
        .status(404)
        .json({ error: "Product not found or already deleted" });

    res
      .status(200)
      .json({ message: `Product ${id} deleted successfully`, deleted: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
