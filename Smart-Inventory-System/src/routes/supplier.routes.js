const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const { createSupplier } = require("../controllers/supplier.controller");

router.post(
  "/",
  auth,
  role("admin"),
  createSupplier
);

module.exports = router;