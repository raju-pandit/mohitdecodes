const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TOZGrdGwMgy14N',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'Faap5rgN9Y7NJ5tFa2lVIJKu'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Please provide a course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.isFree || course.price <= 0) {
      return res.status(400).json({ success: false, message: 'This course is free. Enroll directly.' });
    }

    // Options for Razorpay
    const options = {
      amount: Math.round(course.price * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Create a pending payment log in MongoDB
    await Payment.create({
      user: req.user.id,
      course: course._id,
      razorpayOrderId: order.id,
      amount: course.price,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Razorpay Signature and Enroll
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return res.status(400).json({ success: false, message: 'Please provide all payment verification fields' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'Faap5rgN9Y7NJ5tFa2lVIJKu');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    // Find and update payment log
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found for this order' });
    }

    if (!isSignatureValid) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // Update payment as completed
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // Enroll user in the course
    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Purchased course not found' });
    }

    const alreadyEnrolled = user.enrolledCourses.some(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push({ courseId: course._id });
      await user.save();
      
      course.students += 1;
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrolled successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
};
