const Cart = require("../models/cart.model");
const mongoose = require("mongoose");

exports.getCart = async (req, res) => {
	const userId = req.params.id;

	if (!userId) return res.status(404).json({ error: "User ID is required" });
	if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "User ID is invalid" });

	try {
		const cart = await Cart.findOne({ user: userId }, 'products').populate('products.product', 'name price');
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.addToCart = async (req, res) => {
    const userId = req.params.id;
    const { product, quantity = 1 } = req.body.products || {};

    const validationErrors = [
        !userId && "User ID is required",
        !product && "Product ID is required",
        quantity <= 0 && "Quantity must be greater than 0",
        !mongoose.Types.ObjectId.isValid(product) && "Product ID is invalid",
        !mongoose.Types.ObjectId.isValid(userId) && "User ID is invalid"
    ].filter(Boolean);

    if (validationErrors.length > 0) return res.status(400).json({ errors: validationErrors });

    try {
        const cart = await Cart.findOneAndUpdate(
            { user: userId, "products.product": product },
            { $inc: { "products.$.quantity": quantity } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!cart.products.some(p => p.product.toString() === product)) {
            cart.products.push({ product, quantity });
            await cart.save();
        }

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCart = async (req, res) => {
	const userId = req.params.id;
	const { product, quantity } = req.body.products || {};

	const validationErrors = [
		!userId && "User ID is required",
		!product && "Product ID is required",
		quantity <= 0 && "Quantity must be greater than 0",
		!mongoose.Types.ObjectId.isValid(product) && "Product ID is invalid",
		!mongoose.Types.ObjectId.isValid(userId) && "User ID is invalid"
	].filter(Boolean);

	if (validationErrors.length > 0) return res.status(400).json({ errors: validationErrors });

	try {
		const cart = await Cart.findOneAndUpdate(
			{ user: userId, "products.product": product },
			{ $set: { "products.$.quantity": quantity } },
			{ new: true, runValidators: true }
		).lean().exec();

		if (!cart) return res.status(404).json({ error: "Product not found in cart" });

		res.status(200).json({ message: "Cart updated successfully", cart });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.removeFromCart = async (req, res) => {
  const userId = req.params.id;
  const { product } = req.body;

  const validationErrors = [
	!userId && "User ID is required",
	!product && "Product ID is required",
	!mongoose.Types.ObjectId.isValid(product) && "Product ID is invalid",
	!mongoose.Types.ObjectId.isValid(userId) && "User ID is invalid"
  ].filter(Boolean);

  if (validationErrors.length > 0) return res.status(400).json({ errors: validationErrors });

  try {
	const cart = await Cart.findOne({ user: userId });
	if (!cart) return res.status(404).json({ error: "Cart not found" });

	const productIndex = cart.products.findIndex(p => p.product.toString() === product);
	if (productIndex === -1) return res.status(404).json({ error: "Product not found in cart" });

	cart.products.splice(productIndex, 1);
	await cart.save();

	res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
	res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
	const userId = req.params.id;
	if (!userId) return res.status(404).json({ error: "User ID is required" });
	if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "User ID is invalid" });

	try {
		const result = await Cart.updateOne({ user: userId }, { products: [] }, { runValidators: false });
		if (result.nModified === 0) return res.status(404).json({ error: "Cart not found" });
		
		res.status(200).json({ message: "Cart cleared successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
