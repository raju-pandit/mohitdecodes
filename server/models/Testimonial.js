const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  avatar: { type: String, default: '' },
  role: { type: String, required: true },
  company: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: [true, 'Message is required'], maxlength: 500 },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
