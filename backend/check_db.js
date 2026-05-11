const mongoose = require('mongoose');
const User = require('./models/user');
const Customer = require('./models/customer');
require('dotenv').config();

async function check() {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_db";
    await mongoose.connect(mongoUri);
    
    const alphaCustomer = await Customer.findOne({ name: /Alpha/i });
    console.log("Alpha in Customers:", alphaCustomer ? alphaCustomer : "NOT FOUND");

    const alphaUser = await User.findOne({ name: /Alpha/i });
    console.log("Alpha in Users:", alphaUser ? alphaUser : "NOT FOUND");

    process.exit();
}

check();
