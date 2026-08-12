import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  subscribed: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Newsletter', newsletterSchema);
