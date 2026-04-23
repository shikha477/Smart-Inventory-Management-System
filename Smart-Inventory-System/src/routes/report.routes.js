const express = require("express")

const router = express.Router()

const reportController = require("../controllers/report.controller")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

router.get(
    "/sales",
    authMiddleware,
    roleMiddleware("admin", "staff"),
    reportController.getSalesReport
)

router.get(
    "/inventory",
    authMiddleware,
    roleMiddleware("admin", "staff"),
    reportController.getInventoryReport
)

router.get(
    "/low-stock",
    authMiddleware,
    roleMiddleware("admin", "staff"),
    reportController.getLowStockReport
)

router.get(
    "/export/pdf",
    authMiddleware,
    roleMiddleware("admin", "staff"),
    reportController.exportPDF
)

router.get(
    "/export/excel",
    authMiddleware,
    roleMiddleware("admin", "staff"),
    reportController.exportExcel
)



module.exports = router