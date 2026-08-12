const express = require('express');
const router = express.Router();
const { getResources, getResource, createResource, updateResource, deleteResource, downloadResource, getAdminResources } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getResources);
router.get('/admin/all', protect, authorize('admin'), getAdminResources);
router.get('/:id', getResource);
router.post('/', protect, authorize('admin'), createResource);
router.put('/:id', protect, authorize('admin'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);
router.post('/:id/download', downloadResource);

module.exports = router;
