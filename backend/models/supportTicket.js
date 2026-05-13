const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'supporttickets'
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
