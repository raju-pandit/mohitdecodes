import express from 'express';
const router = express.Router();
import { subscribe, getSubscribers, unsubscribe } from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/auth.js';

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/subscribers', protect, authorize('admin'), getSubscribers);

export default router;
