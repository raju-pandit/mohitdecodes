const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Please add a short description'],
    },
    thumbnail: {
      type: String,
      default: 'no-photo.jpg',
    },
    instructor: {
      name: String,
      avatar: String,
      bio: String,
    },
    category: {
      type: String,
      enum: [
        'JS',
        'JavaScript',
        'React',
        'Node',
        'Node.js',
        'MongoDB',
        'MERN',
        'Backend',
        'Frontend',
        'DSA',
        'Full Stack',
        'Other'
      ],
      required: [true, 'Please select a category'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Please select a difficulty level'],
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      default: '',
    },
    modules: [
      {
        title: String,
        lessons: [
          {
            title: String,
            duration: String,
            videoUrl: String,
            description: String,
            isFree: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    students: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create slug from title
CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Indexes
CourseSchema.index({ slug: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ tags: 1 });

module.exports = mongoose.model('Course', CourseSchema);
