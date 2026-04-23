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

    const pageWidth = doc.page.width
    const left = 50
    const right = pageWidth - 50
    const tableTopStart = 200
    const rowHeight = 26

    const drawHeader = () => {
        doc
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#111827")
            .text("Inventory Report", left, 40, { width: right - left, align: "center" })

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#4B5563")
            .text(`Generated on: ${new Date().toLocaleString()}`, left, 75, {
                width: right - left,
                align: "center"
            })

        doc
            .lineWidth(1)
            .strokeColor("#D1D5DB")
            .moveTo(left, 100)
            .lineTo(right, 100)
            .stroke()

        const totalQuantity = inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(`Total Records: ${inventory.length}`, left, 120)

        doc
            .text(`Total Quantity: ${totalQuantity}`, left + 180, 120)

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#FFFFFF")
            .rect(left, 155, right - left, 24)
            .fill("#1F2937")

        doc
            .fillColor("#FFFFFF")
            .text("#", left + 10, 162)
            .text("Product", left + 45, 162)
            .text("Quantity", right - 100, 162)
    }

    const drawPage = () => {
        drawHeader()
        return tableTopStart
    }

    let y = drawPage()

    if (!inventory.length) {
        doc
            .font("Helvetica")
            .fontSize(12)
            .fillColor("#374151")
            .text("No inventory records found.", left, y + 20)
    } else {
        inventory.forEach((item, index) => {
            if (y + rowHeight > doc.page.height - 50) {
                doc.addPage()
                y = drawPage()
            }

            const bgColor = index % 2 === 0 ? "#F9FAFB" : "#FFFFFF"
            doc
                .rect(left, y, right - left, rowHeight)
                .fill(bgColor)

            doc
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#111827")
                .text(String(index + 1), left + 10, y + 8)
                .text(item.product?.name || "Unknown Product", left + 45, y + 8, { width: right - left - 160 })
                .text(String(item.quantity ?? 0), right - 100, y + 8)

            doc
                .lineWidth(0.5)
                .strokeColor("#E5E7EB")
                .moveTo(left, y + rowHeight)
                .lineTo(right, y + rowHeight)
                .stroke()

            y += rowHeight
        })
    }

    doc.end()

})

// exports.exportPDF = asyncHandler(async (req, res) => {

//     const inventory = await Inventory.find().populate("product")

//     const doc = new PDFDocument()

//     res.setHeader("Content-Type", "application/pdf")
//     res.setHeader("Content-Disposition", "attachment; filename=inventory-report.pdf")

//     doc.pipe(res)

//     doc.fontSize(20).text("Inventory Report", { align: "center" })
//     doc.moveDown()

//     inventory.forEach(item => {
//         doc.fontSize(12).text(
//             `Product: ${item.product.name} | Quantity: ${item.quantity}`
//         )
//     })

//     doc.end()

// })


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