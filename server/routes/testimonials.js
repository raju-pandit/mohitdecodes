import express from 'express';
const router = express.Router();
import { getTestimonials, createTestimonial, approveTestimonial, deleteTestimonial, getAdminTestimonials } from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getTestimonials);
router.get('/admin/all', protect, authorize('admin'), getAdminTestimonials);
router.post('/', createTestimonial);
router.put('/:id/approve', protect, authorize('admin'), approveTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

export default router;
