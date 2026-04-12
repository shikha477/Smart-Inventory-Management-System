const express = require("express");
const router = express.Router();

const forecastController = require("../controllers/forecast.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");


router.get(
  "/all",
  auth,
  role("admin", "manager"),
  forecastController.getAllForecast
);

router.get(
  "/:productId",
  auth,
  role("admin", "manager"),
  forecastController.getProductForecast
);



module.exports = router;