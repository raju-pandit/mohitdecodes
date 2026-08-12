const mongoose = require('mongoose');
const slugify = require('slugify');

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Tutorial title is required'], trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: [true, 'Content is required'] },
  excerpt: { type: String, maxlength: 300 },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  readingTime: { type: Number, default: 5 },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' }
  },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  coverImage: { type: String, default: '' }
}, { timestamps: true });

tutorialSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('content')) {
    const wordCount = this.content.split(' ').length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  next();
});

tutorialSchema.index({ category: 1 });
tutorialSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Tutorial', tutorialSchema);
