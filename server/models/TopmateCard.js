import mongoose from 'mongoose';

const topmateCardSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'TOPMATE',
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    badge: {
      type: String,
      default: 'Available',
      trim: true
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
    }
  },
  {
    timestamps: true
  }
);

// Index for fast public queries
topmateCardSchema.index({ status: 1, displayOrder: 1 });

const TopmateCard = mongoose.models.TopmateCard || mongoose.model('TopmateCard', topmateCardSchema);

export default TopmateCard;
