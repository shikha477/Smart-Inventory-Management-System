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

router.get(
    "/inventory",
    authMiddleware,
    roleMiddleware("admin"),
    reportController.getInventoryReport
)

router.get(
    "/low-stock",
    authMiddleware,
    roleMiddleware("admin"),
    reportController.getLowStockReport
)

router.get(
    "/export/pdf",
    authMiddleware,
    roleMiddleware("admin"),
    reportController.exportPDF
)

router.get(
    "/export/excel",
    authMiddleware,
    roleMiddleware("admin"),
    reportController.exportExcel
)



module.exports = router