const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");


router.get(
  "/overview",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  analyticsController.getOverview
);

router.get(
  "/top-products",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  analyticsController.getTopProducts
);

router.get(
  "/monthly-sales",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  analyticsController.getMonthlySales
);

router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  analyticsController.getRevenue
);

router.get(
  "/inventory-value",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  analyticsController.getInventoryValue
);

module.exports = router;