const Alert = require("../models/alert.model");
const asyncHandler = require("../utils/asyncHandler");


exports.getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find()
    .populate("product", "name sku")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});


exports.getLowStockAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({ type: "LOW_STOCK" })
    .populate("product", "name sku")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});



exports.markAlertAsRead = asyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  res.json({
    success: true,
    message: "Alert marked as read",
    data: alert,
  });
});

exports.deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndDelete(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  res.json({
    success: true,
    message: "Alert deleted successfully",
  });
});