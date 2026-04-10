const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["LOW_STOCK", "SYSTEM"],
        default: "LOW_STOCK"
    },

    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Alert", alertSchema);