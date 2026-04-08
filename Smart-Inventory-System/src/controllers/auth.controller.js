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

