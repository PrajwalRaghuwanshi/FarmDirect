const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    farmer: String,
    district: String,
    description: String,
    organic: Boolean
});

module.exports = mongoose.model("Product", productSchema, "testproduct");