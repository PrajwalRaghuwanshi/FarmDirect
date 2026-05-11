const mongoose = require('mongoose');
const Customer = require('./models/customer');
require('dotenv').config();

async function fix() {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_db";
    await mongoose.connect(mongoUri);
    
    const res = await Customer.updateOne({ mobile: "0987654321" }, { name: "Alpha" });
    console.log("Update Result:", res);
    process.exit();
}

fix();
