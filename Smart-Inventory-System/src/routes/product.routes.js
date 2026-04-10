const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");


router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createProduct
);


router.get(
  "/",
  authMiddleware,
  getProducts
);


router.get(
  "/:id",
  authMiddleware,
  getProductById
);


router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateProduct
);


router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProduct
);

module.exports = router;