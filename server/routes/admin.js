import express from 'express';
const router = express.Router();
import { getStats, getAllUsers, updateUserRole, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

// All admin routes protected
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
