const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const { deleteProduct } = require("../controllers/product.controller");

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteProduct
);

module.exports = router;