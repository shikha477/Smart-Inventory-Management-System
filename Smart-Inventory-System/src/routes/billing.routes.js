const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billing.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");


router.post(
"/",
authMiddleware,
roleMiddleware("admin","staff"),
billingController.createBill
);

module.exports = router;