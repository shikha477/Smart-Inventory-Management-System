const Alert = require("../models/alert.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

const checkLowStock = async () => {
  const inventories = await Inventory.find().populate("product");

  for (const item of inventories) {
    const product = await Product.findById(item.product._id);

    if (!product) continue;

    if (item.quantity <= product.minStock) {
      const exists = await Alert.findOne({
        product: product._id,
        type: "LOW_STOCK",
        isRead: false,
      });

      if (!exists) {
        await Alert.create({
          product: product._id,
          type: "LOW_STOCK",
          message: `Low stock alert for ${product.name}. Remaining: ${item.quantity}`,
        });
      }
    }
  }
};

module.exports = { checkLowStock };