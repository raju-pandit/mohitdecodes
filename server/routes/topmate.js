import express from 'express';
import {
  getTopmateCards,
  getTopmateCard,
  createTopmateCard,
  updateTopmateCard,
  deleteTopmateCard,
  toggleTopmateStatus,
  uploadTopmateImage
} from '../controllers/topmateController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getTopmateCards);
router.get('/:id', getTopmateCard);

// Admin protected routes
router.post('/', protect, authorize('admin'), createTopmateCard);
router.put('/:id', protect, authorize('admin'), updateTopmateCard);
router.delete('/:id', protect, authorize('admin'), deleteTopmateCard);
router.patch('/:id/status', protect, authorize('admin'), toggleTopmateStatus);
router.post('/upload', protect, authorize('admin'), uploadImage.single('image'), uploadTopmateImage);

export default router;
