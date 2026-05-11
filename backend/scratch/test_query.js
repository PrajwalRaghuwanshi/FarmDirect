const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/user');
const Product = require('../models/products');

async function testQuery() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_db");
        console.log("Connected to MongoDB");
        
        console.log("Fetching farmers...");
        const farmers = await User.find({ role: "farmer" });
        const farmerIds = farmers.map(f => f._id);
        console.log("Farmer IDs:", farmerIds);

        console.log("Fetching products...");
        const products = await Product.find({ owner: { $in: farmerIds } }).populate("owner", "name");
        console.log("Products found:", products.length);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testQuery();
