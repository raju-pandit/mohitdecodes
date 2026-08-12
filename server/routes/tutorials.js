import express from 'express';
const router = express.Router();
import { getTutorials, getTutorial, createTutorial, updateTutorial, deleteTutorial, getAdminTutorials } from '../controllers/tutorialController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getTutorials);
router.get('/admin/all', protect, authorize('admin'), getAdminTutorials);
router.get('/:slug', getTutorial);
router.post('/', protect, authorize('admin'), createTutorial);
router.put('/:id', protect, authorize('admin'), updateTutorial);
router.delete('/:id', protect, authorize('admin'), deleteTutorial);

export default router;
