const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const { getAnalytics } = require("../controllers/analytics.controller");

router.get(
  "/",
  auth,
  role("admin"),
  getAnalytics
);

module.exports = router;