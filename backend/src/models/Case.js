const mongoose = require('mongoose');
const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in_progress', 'review', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  description: String,
  courtDates: [{ date: Date, type: String, notes: String }],
  timeline: [{ date: Date, event: String, description: String, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
}, { timestamps: true });
module.exports = mongoose.model('Case', caseSchema);
