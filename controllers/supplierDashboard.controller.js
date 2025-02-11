const Product = require("../models/product.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

exports.getProducts = async (req, res) => {
  const supplierID = req.params.id;
  if (!supplierID)
    return res.status(404).json({ message: "Supplier ID is required" });
  if (!mongoose.Types.ObjectId.isValid(supplierID))
    return res.status(400).json({ message: "Invalid Supplier ID" });
  try {
    const products = await Product.find({ supplier: supplierID });
    if (!products)
      return res.status(404).json({ message: "No products found" });

    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  const supplierID = req.params.id;
  if (!supplierID)
    return res.status(404).json({ message: "Supplier ID is required" });
  if (!mongoose.Types.ObjectId.isValid(supplierID))
    return res.status(400).json({ message: "Invalid Supplier ID" });

  try {
    const orders = await Order.find({ supplier: supplierID });
    if (!orders) return res.status(404).json({ message: "No orders found" });

    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ message: "Order ID and status are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
