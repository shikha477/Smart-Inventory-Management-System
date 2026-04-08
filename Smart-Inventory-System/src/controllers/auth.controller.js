const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


// REGISTER
exports.registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user
  });
});

// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user
  });
});

// Logout
exports.logoutUser = asyncHandler(async (req, res) => {

  res.json({
    success: true,
    message: "Logged out successfully"
  });

});

// Get current user
exports.getCurrentUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    user
  });

});