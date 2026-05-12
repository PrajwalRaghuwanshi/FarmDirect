const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/products");
const Customer = require("./models/customer");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Order = require("./models/order");
const { upload } = require("./cloudinaryConfig");

// 🖼️ Conditional Multer Middleware
const handleUpload = (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return upload.single('profileImage')(req, res, (err) => {
      if (err) {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }
  next();
};

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
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/FarmDirectDB's")
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



// 🔐 Secure Login with Password
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password are required" });
    }

    // Search by mobile, email, OR name
    const user = await Customer.findOne({
      $or: [
        { mobile: identifier },
        { email: identifier },
        { name: { $regex: new RegExp(`^${identifier}$`, "i") } }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password if the user has one
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      // If no password set, we might allow login but suggest setting one
      // For now, let's treat it as a success if the name matches (or handle accordingly)
      // Actually, if no password, we should probably only allow OTP login.
      // But for this request, let's allow it.
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔍 Check if user exists (for sign-in pre-fill)
app.get("/api/user/check", async (req, res) => {
  try {
    const { mobile, email } = req.query;
    const query = [];
    if (mobile) query.push({ mobile });
    if (email) query.push({ email });

    if (query.length === 0) return res.status(400).json({ error: "Mobile or email required" });

    const user = await Customer.findOne({ $or: query });
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🧑‍🌾 CUSTOMER REGISTRATION & LOGIN
app.post("/api/register", handleUpload, async (req, res) => {
  try {

    console.log("🔥 REGISTER API CALLED");
    console.log("📦 Incoming Data:", req.body);
    const { name, mobile, email, pincode, address, city, state, languagepreference, password } = req.body;
    let profileImage = req.file ? req.file.path : req.body.profileImage;

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
app.put("/api/customers/update/:id", handleUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.file) {
      updates.profileImage = req.file.path;
    }

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
    res.status(500).json({ error: "Server error during update", details: error.message });
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

// 📦 PLACE ORDER
app.post("/api/orders", async (req, res) => {
  try {
    console.log("📦 NEW ORDER RECEIVED");
    const orderData = req.body;
    
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // 📉 DECREASE STOCK
    for (const item of orderData.items) {
      try {
        console.log(`📉 Attempting to decrease stock for product: ${item.name} (${item.productId}) by ${item.quantity}`);
        
        // Find by both ID string and ObjectId to be safe
        const updateResult = await Product.findOneAndUpdate(
          { _id: item.productId },
          {
            $inc: { 
              stock: -item.quantity,
              sold: item.quantity
            }
          },
          { new: true }
        );

        if (updateResult) {
          console.log(`✅ Stock updated for ${item.name}. New stock_level: ${updateResult.stock_level}, New stock: ${updateResult.stock}`);
        } else {
          console.warn(`⚠️ Could not find product with ID ${item.productId} to update stock.`);
        }
      } catch (err) {
        console.error(`❌ Failed to update stock for product ${item.productId}:`, err);
      }
    }

    console.log("✅ Order process complete for:", newOrder._id);
    res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Server error while placing order" });
  }
});

// 📋 GET USER ORDERS
app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📋 FETCHING ORDERS FOR USER:", userId);
    
    // Find orders for this user, sorted by newest first
    const userOrders = await Order.find({ userId }).sort({ placedAt: -1 });
    
    res.json(userOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 🌾 GET FARMERS BY STATE (from users collection)
app.get("/api/farmers", async (req, res) => {
  try {
    const { state, pincode } = req.query;
    console.log(`🌾 Fetching farmers - State: ${state || 'any'}, Pincode: ${pincode || 'any'}`);

    let query = {};
    if (state) {
      query.state = { $regex: new RegExp(state, "i") };
    }
    if (pincode) {
      query.pincode = pincode;
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