const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['report', 'legal', 'medical', 'education', 'other'], default: 'other' },
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedChild: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
  relatedCase: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  tags: [String],
}, { timestamps: true });
module.exports = mongoose.model('Document', documentSchema);
