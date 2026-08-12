import express from 'express';
const router = express.Router();
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, getAdminCourses, toggleLessonComplete } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getCourses);
router.get('/admin/all', protect, authorize('admin'), getAdminCourses);
router.put('/lessons/toggle-complete', protect, toggleLessonComplete);
router.get('/:slug', getCourse);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

export default router;
