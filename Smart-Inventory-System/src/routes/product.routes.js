const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const { deleteProduct } = require("../controllers/product.controller");

router.delete(
"/:id",
protect,
authorizeRoles("admin"),
deleteProduct
);

module.exports = router;