const Product = require("../models/product.model");
const Inventory = require("../models/inventory.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addStock = asyncHandler(async (req, res) => {

  const { productId, quantity, note } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "ProductId and quantity required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const previousStock = product.stock;
  const newStock = previousStock + quantity;

  product.stock = newStock;
  await product.save();

  const transaction = await Inventory.create({
    product: productId,
    type: "ADD",
    quantity,
    previousStock,
    newStock,
    note,
    createdBy: req.user?._id,
  });

  res.status(200).json({
    success: true,
    message: "Stock added successfully",
    data: transaction,
  });
});


exports.removeStock = asyncHandler(async (req, res) => {

  const { productId, quantity, note } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "ProductId and quantity required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  const previousStock = product.stock;
  const newStock = previousStock - quantity;

  product.stock = newStock;
  await product.save();

  const transaction = await Inventory.create({
    product: productId,
    type: "REMOVE",
    quantity,
    previousStock,
    newStock,
    note,
    createdBy: req.user?._id,
  });

  res.status(200).json({
    success: true,
    message: "Stock removed successfully",
    data: transaction,
  });
});

exports.getInventoryHistory = asyncHandler(async (req, res) => {

  const history = await Inventory.find()
    .populate("product", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

exports.getProductInventory = asyncHandler(async (req, res) => {

  const productId = req.params.id;

  const history = await Inventory.find({ product: productId })
    .populate("product", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

exports.inventorySummary = asyncHandler(async (req, res) => {

  const totalProducts = await Product.countDocuments();

  const totalStock = await Product.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$stock" }
      }
    }
  ]);

  const totalTransactions = await Inventory.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      totalTransactions
    }
  });
});