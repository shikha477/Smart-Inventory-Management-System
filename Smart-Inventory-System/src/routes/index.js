const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const productRoutes = require("./product.routes");
const supplierRoutes = require("./supplier.routes");
const inventoryRoutes = require("./inventory.routes");
const billingRoutes = require("./billing.routes");
const alertRoutes = require("./alert.routes");
const analyticsRoutes = require("./analytics.routes");
const forecastRoutes = require("./forecast.routes");

const router = express.Router();

router.get("/health",(req,res)=>{
res.json({
success:true,
message:"Smart Inventory API running "
});
});

router.use("/auth",authRoutes);
router.use("/users",userRoutes);

router.use("/products", productRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/bills", billingRoutes);
router.use("/alerts", alertRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/forecast", forecastRoutes);

module.exports = router;