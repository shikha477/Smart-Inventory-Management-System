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

