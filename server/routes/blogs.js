import express from 'express';
const router = express.Router();
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, addComment, toggleSaveBlog, getAdminBlogs } from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getBlogs);
router.get('/admin/all', protect, authorize('admin'), getAdminBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);
router.post('/:id/comment', addComment);
router.post('/:id/save', protect, toggleSaveBlog);

export default router;
