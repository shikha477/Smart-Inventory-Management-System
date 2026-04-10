const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.post(
  "/add-stock",
  authMiddleware,
  inventoryController.addStock
);

router.post(
  "/remove-stock",
  authMiddleware,
  inventoryController.removeStock
);

router.get(
  "/history",
  authMiddleware,
  inventoryController.getInventoryHistory
);

router.get(
  "/product/:id",
  authMiddleware,
  inventoryController.getProductInventory
);

router.get(
  "/summary",
  authMiddleware,
  inventoryController.inventorySummary
);

module.exports = router;