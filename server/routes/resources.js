import express from 'express';
const router = express.Router();
import { getResources, getResource, createResource, updateResource, deleteResource, downloadResource, getAdminResources } from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getResources);
router.get('/admin/all', protect, authorize('admin'), getAdminResources);
router.get('/:id', getResource);
router.post('/', protect, authorize('admin'), createResource);
router.put('/:id', protect, authorize('admin'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);
router.post('/:id/download', downloadResource);

export default router;
