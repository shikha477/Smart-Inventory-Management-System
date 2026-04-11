const express = require("express");
const router = express.Router();

const alertController = require("../controllers/alert.controller");
const  protect  = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");



router.get(
  "/",
  protect,
  role("admin", "manager"),
  alertController.getAllAlerts
);

router.get(
  "/low-stock",
  protect,
  role("admin", "manager"),
  alertController.getLowStockAlerts
);

router.patch("/:id/read",protect,role("admin", "manager"),alertController.markAlertAsRead
);

router.delete(
  "/:id",
  protect,
  role("admin"),
  alertController.deleteAlert
);

module.exports = router;