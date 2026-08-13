import express from 'express';
const router = express.Router();
import { register, login, logout, getMe, forgotPassword, resetPassword, updateProfile, socialLogin, googleLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/google', googleLogin);
router.post('/social-login', socialLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-profile', protect, updateProfile);

export default router;
