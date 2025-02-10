const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.getUsers = async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", ...query } = req.query;
	const sort = { [sortBy]: order === "desc" ? -1 : 1 };
	const skip = (page - 1) * limit;

	try {
		const users = await User.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean().exec();
		const total = await User.countDocuments(query);

		if (!users.length) return res.status(404).json({ error: "Users not found" });

		res.json({ data: users, total });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getProducts = async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", ...query } = req.query;
	const sort = { [sortBy]: order === "desc" ? -1 : 1 };
	const skip = (page - 1) * limit;

	try {
		const products = await Product.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean().exec();
		const total = await Product.countDocuments(query);

		if (!products.length) return res.status(404).json({ error: "Products not found" });

		res.json({ data: products, total });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getOrders = async (req, res) => {
	const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", ...query } = req.query;
	const sort = { [sortBy]: order === "desc" ? -1 : 1 };
	const skip = (page - 1) * limit;

	try {
		const orders = await Order.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean().exec();
		const total = await Order.countDocuments(query);

		if (!orders.length) return res.status(404).json({ error: "Orders not found" });

		res.json({ data: orders, total });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getAnalytics = async (req, res) => {
	try {
		// get all users by type
		const totalUsers = await User.countDocuments({ role: "User" });
		const totalSuppliers = await User.countDocuments({ role: "Supplier" });

		// get all orders by status
		const totalProducts = await Product.countDocuments({ quantity: { $gt: 0 }, status: "active" });
		const totalOrders = await Order.countDocuments({ status: "completed" });
		const totalPendingOrders = await Order.countDocuments({ status: "pending" });
		const totalCancelledOrders = await Order.countDocuments({ status: "cancelled" });

		// get total sales and some statistics
		const totalSales = await Order.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
		const [maxPrice] = await Product.aggregate([{ $group: { _id: null, maxPrice: { $max: "$price" } } }]);
		const [minPrice] = await Product.aggregate([{ $group: { _id: null, minPrice: { $min: "$price" } } }]);
		const [avgPrice] = await Product.aggregate([{ $group: { _id: null, avgPrice: { $avg: "$price" } } }]);

		// TODO: Implement additional analytics
		// Example: Calculate the number of products that are out of stock
		const outOfStockProducts = await Product.countDocuments({ quantity: 0 });

		res.json({ data: { totalUsers, totalSuppliers, totalProducts, totalOrders, totalPendingOrders, totalCancelledOrders, totalSales: totalSales[0]?.total || 0, maxPrice: maxPrice?.maxPrice || 0, minPrice: minPrice?.minPrice || 0, avgPrice: avgPrice?.avgPrice || 0, outOfStockProducts } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

