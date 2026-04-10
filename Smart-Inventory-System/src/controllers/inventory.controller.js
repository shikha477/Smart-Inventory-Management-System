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