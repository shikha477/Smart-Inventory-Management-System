const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post(
  "/add-stock",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryController.addStock
);

router.post(
  "/remove-stock",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryController.removeStock
);

router.get(
  "/history",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  inventoryController.getInventoryHistory
);

router.get(
  "/product/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  inventoryController.getProductInventory
);

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("admin"),
  inventoryController.inventorySummary
);

module.exports = router;