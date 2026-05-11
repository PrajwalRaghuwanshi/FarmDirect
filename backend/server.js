const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/products");
const Customer = require("./models/customer");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const app = express();

app.get("/api/products/by-farmers", async (req, res) => {
  try {
    const { state } = req.query;

    let query = {};
    if (state) {
      query.state = { $regex: new RegExp(state, "i") };
    }

    // 1. Get farmers
    const farmers = await User.find(query);

    const farmerIds = farmers.map(f => f._id);

    // 2. Get products where owner is in farmerIds
    const products = await Product.find({
      owner: { $in: farmerIds }
    }).populate("owner", "name state");

    res.json({ products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));
app.use(express.json());

// 🔌 Connect MongoDB (local)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_db")
  .then(() => {
    console.log("MongoDB connected");
    console.log("DATABASE:", process.env.MONGO_URI);
  })
  .catch(err => console.log(err));

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("Server + DB working");
});


// 📡 Get all products (only from farmers)
app.get("/products", async (req, res) => {
  try {
    const farmers = await User.find({});
    const farmerIds = farmers.map(f => f._id);
    
    const products = await Product.find({
      owner: { $in: farmerIds }
    }).populate("owner", "name state");
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 📍 Get local products by district
app.get("/api/products/local", async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ error: "District is required" });
    }

    const farmers = await User.find({
      city: { $regex: new RegExp(district, "i") }
    });

    const farmerIds = farmers.map(f => f._id);
    const products = await Product.find({
      owner: { $in: farmerIds }
    }).populate("owner", "name state");

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch local products" });
  }
});

// Alias for products
app.get("/api/products", async (req, res) => {
  try {
    const farmers = await User.find({});
    const farmerIds = farmers.map(f => f._id);
    const products = await Product.find({ owner: { $in: farmerIds } }).populate("owner", "name state");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// 🧑‍🌾 CUSTOMER REGISTRATION & LOGIN
app.post("/api/register", async (req, res) => {
  try {

    console.log("🔥 REGISTER API CALLED");
    console.log("📦 Incoming Data:", req.body);
    const { name, mobile, email, pincode, address, city, state, profileImage, languagepreference, password } = req.body;

    // Validation
    if (!mobile && !email) {
      return res.status(400).json({ error: "Either phone number or email is required" });
    }

    if (mobile && mobile.length !== 10) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email must be valid" });
      }
    }

    // Check duplicates using mobile OR email
    let query = [];
    if (mobile) query.push({ mobile });
    if (email) query.push({ email });

    let existingUser = await Customer.findOne({ $or: query });

    if (existingUser) {
      // Prevent duplicate accounts by logging in the existing user and updating any new fields
      if (email && existingUser.email && existingUser.email !== email && mobile) {
        // Checking if another account uses this email
        const emailExists = await Customer.findOne({ email });
        if (emailExists && emailExists._id.toString() !== existingUser._id.toString()) {
          return res.status(400).json({ error: "Email is already registered to another account" });
        }
      }

      if (name) existingUser.name = name;
      if (pincode) existingUser.pincode = pincode;
      if (city) existingUser.city = city;
      if (state) existingUser.state = state;
      if (email) existingUser.email = email;
      if (languagepreference) existingUser.languagepreference = languagepreference;

      await existingUser.save();
      return res.status(200).json({ message: "User logged in successfully", user: existingUser });
    }

    // Check if email already used by someone else
    if (email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already registered" });
      }
    }

    // Hash password if provided
    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    const newCustomer = new Customer({
      name, mobile, email, pincode, address, city, state, profileImage, languagepreference, password: hashedPassword
    });

    console.log("💾 Saving customer:", newCustomer);
    await newCustomer.save();

    console.log("✅ Customer saved successfully");
    res.status(201).json({ message: "Registration successful", user: newCustomer });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// 🧑‍🌾 CUSTOMER UPDATE
app.put("/api/customers/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.mobile && updates.mobile.length !== 10) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedCustomer });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error during update" });
  }
});


// 🧑‍🌾 GET CUSTOMER
app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🌾 GET FARMERS BY STATE (from users collection)
app.get("/api/farmers", async (req, res) => {
  try {
    const { state } = req.query;

    console.log("🌾 Fetching farmers, state:", state || 'all');

    let query = {};
    if (state) {
      query.state = { $regex: new RegExp(state, "i") };
    }

    const farmers = await User.find(query);

    res.json({ farmers });

  } catch (err) {
    console.error("Farmers fetch error:", err);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});