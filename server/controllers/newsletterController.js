const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ success: false, message: 'This email is already subscribed!' });
      }
      existing.subscribed = true;
      await existing.save();
      return res.status(200).json({ success: true, message: 'Welcome back! You\'ve been re-subscribed 🎉' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Successfully subscribed! Get ready for awesome content 🚀' });
  } catch (err) { next(err); }
};

exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ subscribed: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscribers, total: subscribers.length });
  } catch (err) { next(err); }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOneAndUpdate(
      { email }, { subscribed: false, unsubscribedAt: Date.now() }, { new: true }
    );
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) { next(err); }
};
