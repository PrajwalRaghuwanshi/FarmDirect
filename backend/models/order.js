const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String },
  customerDetails: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    notes: { type: String }
  },
  items: [{
    productId: { type: String, required: true },
    farmerId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  summary: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Processing" 
  },
  placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
