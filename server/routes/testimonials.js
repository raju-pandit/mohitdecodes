const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, approveTestimonial, deleteTestimonial, getAdminTestimonials } = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTestimonials);
router.get('/admin/all', protect, authorize('admin'), getAdminTestimonials);
router.post('/', createTestimonial);
router.put('/:id/approve', protect, authorize('admin'), approveTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

module.exports = router;
