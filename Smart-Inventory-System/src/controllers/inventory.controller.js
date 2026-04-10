const Product = require("../models/product.model");
const Inventory = require("../models/inventory.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { checkLowStock } = require("./alert.controller");


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

exports.checkLowStock = async (productId) => {

    const inventory = await Inventory.findOne({ product: productId }).populate("product");

    if (!inventory) return;

    if (inventory.quantity <= inventory.product.lowStockThreshold) {

        const existingAlert = await Alert.findOne({
            product: productId,
            isRead: false
        });

        if (!existingAlert) {
            await Alert.create({
                product: productId,
                message: `Low stock for product: ${inventory.product.name}`
            });
        }
    }
};


exports.updateInventory = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body;

    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
        return res.status(404).json({
            success: false,
            message: "Inventory not found"
        });
    }

    inventory.quantity = quantity;

    await inventory.save();
    await checkLowStock(productId);

    res.status(200).json({
        success: true,
        message: "Inventory updated successfully",
        data: inventory
    });

});