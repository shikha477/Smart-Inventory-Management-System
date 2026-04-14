const PDFDocument = require("pdfkit")
const ExcelJS = require("exceljs")

const Product = require("../models/product.model")
const Inventory = require("../models/inventory.model")
const Bill = require("../models/bill.model")

const asyncHandler = require("../utils/asyncHandler")


exports.getSalesReport = asyncHandler(async (req, res) => {

    const sales = await Bill.find().populate("items.product")

    let totalRevenue = 0

    sales.forEach(bill => {
        totalRevenue += bill.totalAmount
    })

    res.json({
        success: true,
        totalSales: sales.length,
        totalRevenue,
        sales
    })

})


exports.getInventoryReport = asyncHandler(async (req, res) => {

    const inventory = await Inventory.find().populate("product")

    const totalProducts = inventory.length

    res.json({
        success: true,
        totalProducts,
        inventory
    })

})



exports.getLowStockReport = asyncHandler(async (req, res) => {

    const lowStock = await Inventory.find({
        quantity: { $lte: 10 }
    }).populate("product")

    res.json({
        success: true,
        count: lowStock.length,
        products: lowStock
    })

})


exports.exportPDF = asyncHandler(async (req, res) => {

    const inventory = await Inventory.find().populate("product")

    const doc = new PDFDocument()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=inventory-report.pdf")

    doc.pipe(res)

    doc.fontSize(20).text("Inventory Report", { align: "center" })
    doc.moveDown()

    inventory.forEach(item => {
        doc.fontSize(12).text(
            `Product: ${item.product.name} | Quantity: ${item.quantity}`
        )
    })

    doc.end()

})


exports.exportExcel = asyncHandler(async (req, res) => {

    const inventory = await Inventory.find().populate("product")

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet("Inventory")

    worksheet.columns = [
        { header: "Product", key: "product", width: 30 },
        { header: "Quantity", key: "quantity", width: 15 }
    ]

    inventory.forEach(item => {
        worksheet.addRow({
            product: item.product.name,
            quantity: item.quantity
        })
    })

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=inventory-report.xlsx"
    )

    await workbook.xlsx.write(res)

    res.end()

})