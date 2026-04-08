const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Inventory API running 🚀",
  });
});

module.exports = router;