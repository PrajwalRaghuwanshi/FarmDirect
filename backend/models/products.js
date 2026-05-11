const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    unit: String,
    price: Number,
    badge: String,
    image: String,
    description: String,
    origin: String,
    stock_level: Number,
    rating: Number,
    farm_name: String,
    highlights: [String],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);