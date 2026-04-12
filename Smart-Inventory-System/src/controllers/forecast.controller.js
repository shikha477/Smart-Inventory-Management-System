const Product = require("../models/product.model");
const Bill = require("../models/bill.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const calculateMovingAverage = (salesArray) => {
  if (salesArray.length === 0) return 0;

  const sum = salesArray.reduce((a, b) => a + b, 0);
  return sum / salesArray.length;
};

const detectTrend = (salesArray) => {
  if (salesArray.length < 2) return "stable";

  const first = salesArray[0];
  const last = salesArray[salesArray.length - 1];

  if (last > first) return "increasing";
  if (last < first) return "decreasing";

  return "stable";
};

exports.getProductForecast = asyncHandler(async (req, res) => {

  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // get last 30 days sales
  const bills = await Bill.find({
    "items.product": productId,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  let dailySales = [];

  bills.forEach((bill) => {
    bill.items.forEach((item) => {
      if (item.product.toString() === productId) {
        dailySales.push(item.quantity);
      }
    });
  });

  const avgDailySales = calculateMovingAverage(dailySales);
  const trend = detectTrend(dailySales);

  const predictedNextWeek = Math.round(avgDailySales * 7);

  const suggestedStock = Math.round(predictedNextWeek * 1.3);

  res.status(200).json({
    success: true,
    product: product.name,
    avgDailySales,
    trend,
    predictedNextWeek,
    suggestedStock
  });

});


exports.getAllForecast = asyncHandler(async (req, res) => {

  const products = await Product.find();

  let forecasts = [];

  for (let product of products) {

    const bills = await Bill.find({
      "items.product": product._id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    let sales = [];

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (item.product.toString() === product._id.toString()) {
          sales.push(item.quantity);
        }
      });
    });

    const avgDailySales = calculateMovingAverage(sales);
    const trend = detectTrend(sales);

    const predictedNextWeek = Math.round(avgDailySales * 7);
    const suggestedStock = Math.round(predictedNextWeek * 1.3);

    forecasts.push({
      productId: product._id,
      productName: product.name,
      avgDailySales,
      trend,
      predictedNextWeek,
      suggestedStock
    });
  }

  res.status(200).json({
    success: true,
    count: forecasts.length,
    forecasts
  });

});