const Bill = require("../models/bill.model");

exports.createBill = async (req, res) => {

  try {

    const bill = await Bill.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: bill
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};