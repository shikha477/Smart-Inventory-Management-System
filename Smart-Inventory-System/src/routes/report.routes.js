const express = require("express")

const router = express.Router()

const reportController = require("../controllers/report.controller")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

router.get(
    "/sales",
    authMiddleware,
    roleMiddleware("admin"),
    reportController.getSalesReport
)