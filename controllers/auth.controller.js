const User = require("../models/user.model");
const hashing = require("../utili/hashing");
const auth = require("../utili/auth");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const nameRegex = /^[a-zA-Z0-9 ]+$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+$/;

  const validationErrors = [
    !name && "Name is required",
    !email && "Email is required",
    !password && "Password is required",
    name && !nameRegex.test(name) && "Invalid name",
    name &&
      (name.length < 3 || name.length > 15) &&
      "Name must be between 3 and 20 characters",
    email && !emailRegex.test(email) && "Invalid email address",
    password &&
      !passwordRegex.test(password) &&
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    password &&
      (password.length < 6 || password.length > 15) &&
      "Password must be between 6 and 15 characters",
    role &&
      !["User", "Supplier"].includes(role) &&
      "Invalid role",
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashing.hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    });
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+$/;

  const validationErrors = [
    !email && "Email is required",
    !password && "Password is required",
    email && !emailRegex.test(email) && "Invalid email address",
    password &&
      !passwordRegex.test(password) &&
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    if (!(await hashing.isMatch(password, user.password))) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const payload = { id: user._id, role: user.role };
    const accessToken = auth.createAccessToken(payload);
    const refreshToken = auth.createRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
