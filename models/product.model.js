const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "unactive", "deleted"],
      default: "active",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "60f3b4b3b3b3f40015f1f3b3",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
