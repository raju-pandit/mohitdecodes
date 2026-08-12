import express from 'express';
const router = express.Router();
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
