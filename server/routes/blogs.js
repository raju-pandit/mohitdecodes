const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, addComment, toggleSaveBlog, getAdminBlogs } = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/admin/all', protect, authorize('admin'), getAdminBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);
router.post('/:id/comment', addComment);
router.post('/:id/save', protect, toggleSaveBlog);

module.exports = router;
