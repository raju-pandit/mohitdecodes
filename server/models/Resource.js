const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Resource title is required'], trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['PDF', 'Cheat Sheet', 'Notes', 'Interview Questions', 'Roadmap', 'Template', 'Coding Problems', 'Other']
  },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  fileSize: { type: String, default: '0 KB' },
  downloads: { type: Number, default: 0 },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  previewUrl: { type: String, default: '' }
}, { timestamps: true });

resourceSchema.index({ category: 1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
