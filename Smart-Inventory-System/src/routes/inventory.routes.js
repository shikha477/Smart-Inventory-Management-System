const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");


router.get(
"/",
authMiddleware,
roleMiddleware("admin","staff"),
inventoryController.getInventory
);

router.put(
"/:productId",
authMiddleware,
roleMiddleware("admin"),
inventoryController.updateInventory
);


module.exports = router;