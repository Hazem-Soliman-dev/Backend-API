const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ["active", "unactive", "deleted"],
			default: "active",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
