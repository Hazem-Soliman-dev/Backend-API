const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const authRoutes = require("./routes/authentication.route");
const productsRoutes = require("./routes/products.route");
const categoriesRoutes = require("./routes/category.route");
const cartRoutes = require("./routes/cart.route");
const ordersRoutes = require("./routes/orders.route");
const adminDahsboardRoutes = require("./routes/adminDashboard.route");
const supplierDashboardRoutes = require("./routes/supplierDashboard.route");

require("dotenv").config();

const port = process.env.PORT || 3000;
const mongo_url = process.env.MONGODB_URI;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/images", express.static("./images"));
app.use("/api/auth", authRoutes);
app.use("/api/product", productsRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", ordersRoutes);
app.use("/api/admin", adminDahsboardRoutes);
app.use("/api/supplier", supplierDashboardRoutes);

mongoose
  .connect(mongo_url)
  .then(() =>
    app.listen(port, () => console.log(`Server is running on port ${port}`))
  )
  .catch(console.error);
