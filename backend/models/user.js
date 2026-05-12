const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        language: String,

        phone: String,
        pincode: Number,
        state: String,
        city: String,

        bio: String,
        gender: String,
        dob: String,

        role: {
            type: String,
            default: "farmer"
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        isDemoUser: {
            type: Boolean,
            default: false
        },

        crops: {
            type: Array,
            default: []
        },

        certifications: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        collection: "Farmer"
    }
);

module.exports = mongoose.model("User", userSchema);