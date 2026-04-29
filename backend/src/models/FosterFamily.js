const mongoose = require('mongoose');
const fosterFamilySchema = new mongoose.Schema({
  familyName: { type: String, required: true },
  primaryContact: { name: String, phone: String, email: String },
  address: { street: String, city: String, state: String, zip: String },
  status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'pending' },
  capacity: { type: Number, default: 1 },
  currentPlacements: { type: Number, default: 0 },
  certificationDate: Date,
  certificationExpiry: Date,
  preferences: { ageRange: { min: Number, max: Number }, gender: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  notes: String,
}, { timestamps: true });
module.exports = mongoose.model('FosterFamily', fosterFamilySchema);
