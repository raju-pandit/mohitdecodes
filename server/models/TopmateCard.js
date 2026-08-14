import mongoose from 'mongoose';

const topmateCardSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: '/logo.png',
      trim: true
    },
    image: {
      type: String,
      default: '/logo.png',
      trim: true
    },
    badge: {
      type: String,
      default: 'TOPMATE',
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
      maxlength: [600, 'Description cannot exceed 600 characters']
    },
    buttonText: {
      type: String,
      default: 'Book on Topmate',
      trim: true
    },
    url: {
      type: String,
      default: 'https://topmate.io/mohitdecodes',
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    cloudinaryPublicId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Fast indexing for public active cards
topmateCardSchema.index({ status: 1, displayOrder: 1, createdAt: -1 });

const TopmateCard = mongoose.models.TopmateCard || mongoose.model('TopmateCard', topmateCardSchema);

export default TopmateCard;
