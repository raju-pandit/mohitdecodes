import express from 'express';
const router = express.Router();
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getProjects);
router.get('/:slug', getProject);
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
