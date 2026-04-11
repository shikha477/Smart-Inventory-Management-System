const asyncHandler = require("../utils/asyncHandler");

const Product = require("../models/product.model");
const Inventory = require("../models/inventory.model");
const Bill = require("../models/bill.model");


exports.getOverview = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalInventoryItems = await Inventory.countDocuments();
  const totalBills = await Bill.countDocuments();

  const revenueResult = await Bill.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalInventoryItems,
      totalBills,
      totalRevenue,
    },
  });
});


exports.getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Bill.aggregate([
    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },

    { $sort: { totalSold: -1 } },

    { $limit: 5 },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },

    { $unwind: "$product" },

    {
      $project: {
        _id: 0,
        productId: "$product._id",
        name: "$product.name",
        totalSold: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: topProducts,
  });
});


exports.getMonthlySales = asyncHandler(async (req, res) => {
  const monthlySales = await Bill.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalSales: { $sum: "$totalAmount" },
      },
    },

    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: monthlySales,
  });
});


exports.getRevenue = asyncHandler(async (req, res) => {
  const revenue = await Bill.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: revenue[0] || { totalRevenue: 0 },
  });
});


exports.getInventoryValue = asyncHandler(async (req, res) => {
  const inventoryValue = await Inventory.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },

    { $unwind: "$product" },

    {
      $project: {
        value: {
          $multiply: ["$quantity", "$product.price"],
        },
      },
    },

    {
      $group: {
        _id: null,
        totalInventoryValue: { $sum: "$value" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: inventoryValue[0] || { totalInventoryValue: 0 },
  });
});