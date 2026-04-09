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


exports.getSuppliers = asyncHandler(async (req, res) => {

    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.json({
        success: true,
        count: suppliers.length,
        data: suppliers
    });

});