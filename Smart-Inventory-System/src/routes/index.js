const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.get("/health",(req,res)=>{
res.json({
success:true,
message:"Smart Inventory API running 🚀"
});
});

router.use("/auth",authRoutes);
router.use("/users",userRoutes);

router.use("/products", require("./product.routes"));
router.use("/suppliers", require("./supplier.routes"));
router.use("/analytics", require("./analytics.routes"));
router.use("/bills", require("./billing.routes"));

module.exports = router;