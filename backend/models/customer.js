const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  pincode: { type: String },
  registrationdate: { type: Date, default: Date.now },
  languagepreference: { type: String, default: 'English' },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  profileImage: { type: String },
  password: { type: String }
}, {
  timestamps: true,
  collection: 'Buyer'
});

module.exports = mongoose.model('Customer', customerSchema);
