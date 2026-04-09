const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateSKU } = require("../utils/constants");


exports.createProduct = asyncHandler(async (req, res) => {

  const { name, description, category, price, stock, reorderLevel, supplier } = req.body;

  const product = await Product.create({

    name,
    description,
    category,
    price,
    stock,
    reorderLevel,
    supplier,
    sku: generateSKU()

  });

  res.status(201).json({
    success: true,
    data: product
  });

});


exports.getProducts = asyncHandler(async (req, res) => {

  const products = await Product.find().populate("supplier");

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });

});


exports.getProductById = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id).populate("supplier");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    data: product
  });

});


exports.updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  Object.assign(product, req.body);

  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });

});


exports.deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });

});