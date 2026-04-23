const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billing.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  billingController.createBill
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  billingController.getBills
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  billingController.getBillById
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  billingController.deleteBill
);

module.exports = router;