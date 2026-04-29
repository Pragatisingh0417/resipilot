const mongoose = require('mongoose');
const childSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  gender: String,
  status: { type: String, enum: ['active', 'placed', 'reunified', 'aged_out'], default: 'active' },
  photoUrl: String,
  medicalInfo: String,
  educationInfo: String,
  notes: String,
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentPlacement: { type: mongoose.Schema.Types.ObjectId, ref: 'FosterFamily' },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
}, { timestamps: true });
module.exports = mongoose.model('Child', childSchema);
