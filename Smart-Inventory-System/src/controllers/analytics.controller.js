const Product = require("../models/product.model");
const Bill = require("../models/bill.model");

exports.getAnalytics = async (req, res) => {

  try {

    const totalProducts = await Product.countDocuments();

    const totalBills = await Bill.countDocuments();

    res.json({
      success: true,
      data: {
        totalProducts,
        totalBills
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};