const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Project title is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

projectSchema.index({ technologies: 1 });
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
