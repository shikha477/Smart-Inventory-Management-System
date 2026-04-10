const Alert = require("../models/alert.model");
const Product = require("../models/product.model");
const Inventory = require("../models/inventory.model");
const asyncHandler = require("../utils/asyncHandler");


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


exports.getAlerts = asyncHandler(async (req, res) => {

    const alerts = await Alert.find()
        .populate("product", "name sku")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts
    });

});


exports.getLowStockAlerts = asyncHandler(async (req, res) => {

    const alerts = await Alert.find({ type: "LOW_STOCK" })
        .populate("product", "name sku")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts
    });

});


exports.markAlertRead = asyncHandler(async (req, res) => {

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
        return res.status(404).json({
            success: false,
            message: "Alert not found"
        });
    }

    alert.isRead = true;
    await alert.save();

    res.status(200).json({
        success: true,
        message: "Alert marked as read",
        data: alert
    });

});


exports.deleteAlert = asyncHandler(async (req, res) => {

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
        return res.status(404).json({
            success: false,
            message: "Alert not found"
        });
    }

    await alert.deleteOne();

    res.status(200).json({
        success: true,
        message: "Alert deleted"
    });

});