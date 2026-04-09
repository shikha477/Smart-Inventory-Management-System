const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const { createBill } = require("../controllers/billing.controller");


router.post(
"/",
protect,
authorizeRoles("admin","staff"),
createBill
);

module.exports = router;