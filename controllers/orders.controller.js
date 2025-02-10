const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

exports.getOrders = async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", ...query } = req.query;
	const skip = (page - 1) * limit;

	try {
		const orders = await Order.find(query, null, { sort: { [sortBy]: order === "asc" ? 1 : -1 } })
			.skip(skip)
			.limit(limit)
			.lean()
			.exec();

		if (!orders.length) return res.status(404).json({ error: "Orders not found" });

		res.json({ data: orders });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.addOrder = async (req, res) => {
  const { user, products } = req.body;
  const requiredFields = ["user", "products"];

  if (!requiredFields.every(field => field in req.body)) {
	return res.status(400).json({
	  error: "Missing required fields",
	  message: `The following fields are required: ${requiredFields.join(", ")}`,
	});
  }

  const productsArray = products.map(({ product, quantity }) => ({
	product: new mongoose.Types.ObjectId(product), // Add 'new' keyword here
	quantity,
  }));

  try {
	const productsDoc = await Product.find({ _id: { $in: productsArray.map(({ product }) => product) } }, "price");
	const totalPrice = productsArray.reduce((acc, { quantity }, index) => acc + productsDoc[index].price * quantity, 0);

	const order = await Order.create({ user, products: productsArray, totalPrice });
	return res.status(201).json({ message: "Order added successfully", data: order });
  } catch (error) {
	return res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	
	if (!mongoose.Types.ObjectId.isValid(id) || !status) return res.status(400).json({ error: "Invalid order ID or status" });

	try {
		const order = await Order.findByIdAndUpdate(id, { status }, { runValidators: true, new: true });
		if (!order) return res.status(404).json({ error: `Order ${id} not found` });

		res.status(200).json({ message: `Order ${id} updated successfully`, updated: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
