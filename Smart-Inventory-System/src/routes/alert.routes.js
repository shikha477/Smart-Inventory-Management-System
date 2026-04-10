const express = require("express");
const router = express.Router();

const alertController = require("../controllers/alert.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");


router.get(
"/",
protect,
authorize("admin","manager"),
alertController.getAlerts
);


router.get(
"/low-stock",
protect,
authorize("admin","manager"),
alertController.getLowStockAlerts
);


router.patch(
"/:id/read",
protect,
authorize("admin","manager"),
alertController.markAlertRead
);


router.delete(
"/:id",
protect,
authorize("admin"),
alertController.deleteAlert
);


module.exports = router;