const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/products");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB (local)
mongoose.connect("mongodb://127.0.0.1:27017/test_db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("Server + DB working");
});


// 📡 Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 📍 Local Products API (by District)
app.get("/api/products/local", async (req, res) => {
  const { district } = req.query;

  try {
    if (!district) {
      return res.status(400).json({ error: "District query parameter is required" });
    }

    // Query MongoDB products collection using district
    // Case-insensitive search for district
    const localProducts = await Product.find({
      district: { $regex: new RegExp(district, "i") }
    });

    res.json({ products: localProducts });

  } catch (err) {
    console.error("Local discovery error:", err);
    res.status(500).json({ error: "Internal server error during local discovery" });
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});