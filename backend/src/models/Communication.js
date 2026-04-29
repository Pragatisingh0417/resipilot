const mongoose = require('mongoose');
const communicationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  message: String,
  type: { type: String, enum: ['email', 'sms', 'internal', 'note'], default: 'internal' },
  relatedCase: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Communication', communicationSchema);
