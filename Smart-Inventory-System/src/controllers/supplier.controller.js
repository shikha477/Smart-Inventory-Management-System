const Supplier = require("../models/supplier.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


exports.createSupplier = asyncHandler(async (req, res) => {

    const supplier = await Supplier.create(req.body);

    res.status(201).json({
        success: true,
        data: supplier
    });

});