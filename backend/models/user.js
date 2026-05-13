const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        language: String,

        phone: String,
        pincode: mongoose.Schema.Types.Mixed, // Can be string or number
        state: String,
        city: String,
        district: String,
        villageLocality: String,

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

        primaryCrops: {
            type: Array,
            default: []
        },

        otherCrops: {
            type: Array,
            default: []
        },

        profilePhoto: String,
        image: String,

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