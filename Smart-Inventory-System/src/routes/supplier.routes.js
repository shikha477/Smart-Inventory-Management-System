const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplier.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");



router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    supplierController.createSupplier
);

router.get(
    "/",
    authMiddleware,
    supplierController.getSuppliers
);

router.get(
    "/:id",
    authMiddleware,
    supplierController.getSupplierById
);


router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    supplierController.updateSupplier
);


router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    supplierController.deleteSupplier
);

router.get(
    "/:id/products",
    authMiddleware,
    supplierController.getSupplierProducts
);

module.exports = router;