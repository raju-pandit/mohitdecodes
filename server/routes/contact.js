import express from 'express';
const router = express.Router();
import { createContact, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

router.post('/', createContact);
router.get('/', protect, authorize('admin'), getContacts);
router.put('/:id', protect, authorize('admin'), updateContactStatus);

export default router;
