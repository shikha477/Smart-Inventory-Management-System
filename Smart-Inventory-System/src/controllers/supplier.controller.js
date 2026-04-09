const Supplier = require("../models/supplier.model");

exports.createSupplier = async (req, res) => {

  try {

    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      data: supplier
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};