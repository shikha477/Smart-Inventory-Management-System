const Bill = require("../models/bill.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createBill = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Bill must contain items");
  }

  let totalAmount = 0;
  const billItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Not enough stock for ${product.name}`);
    }

    const subtotal = product.price * item.quantity;

    billItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      subtotal,
    });

    totalAmount += subtotal;

    // Auto stock deduction
    product.stock -= item.quantity;
    await product.save();
  }

  const bill = await Bill.create({
    billNumber: `BILL-${Date.now()}`,
    items: billItems,
    totalAmount,
    createdBy: req.user?.id,
  });

  res.status(201).json({
    success: true,
    message: "Bill created successfully",
    data: bill,
  });
});

exports.getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find()
    .populate("items.product", "name price")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills,
  });
});

