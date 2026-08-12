const mongoose = require('mongoose');
const slugify = require('slugify');

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  category: { type: String, default: '' },
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String, enum: ['article', 'video', 'course', 'documentation', 'practice'], default: 'article' }
  }],
  isOptional: { type: Boolean, default: false }
});

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Roadmap title is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedDuration: { type: String, default: '3 months' },
  steps: [stepSchema],
  isPublished: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  color: { type: String, default: '#7c3aed' }
}, { timestamps: true });

roadmapSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

roadmapSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Roadmap', roadmapSchema);
