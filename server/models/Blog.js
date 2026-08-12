import mongoose from 'mongoose';
import slugify from 'slugify';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: String,
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    coverImage: {
      type: String,
    },
    author: {
      name: String,
      avatar: String,
      bio: String,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    seoTitle: String,
    seoDescription: String,
    comments: [
      {
        name: String,
        email: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        approved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create slug from title
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Blog', BlogSchema);
