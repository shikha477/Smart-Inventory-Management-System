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


exports.getSupplierById = asyncHandler(async (req, res) => {

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    res.json({
        success: true,
        data: supplier
    });

});


exports.updateSupplier = asyncHandler(async (req, res) => {

    const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    res.json({
        success: true,
        data: supplier
    });

});


exports.deleteSupplier = asyncHandler(async (req, res) => {

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    await supplier.deleteOne();

    res.json({
        success: true,
        message: "Supplier deleted successfully"
    });

});


exports.getSupplierProducts = asyncHandler(async (req, res) => {

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    const products = await Product.find({ supplier: supplier._id });

    res.json({
        success: true,
        count: products.length,
        data: products
    });

});