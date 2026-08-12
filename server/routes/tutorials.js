const express = require('express');
const router = express.Router();
const { getTutorials, getTutorial, createTutorial, updateTutorial, deleteTutorial, getAdminTutorials } = require('../controllers/tutorialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTutorials);
router.get('/admin/all', protect, authorize('admin'), getAdminTutorials);
router.get('/:slug', getTutorial);
router.post('/', protect, authorize('admin'), createTutorial);
router.put('/:id', protect, authorize('admin'), updateTutorial);
router.delete('/:id', protect, authorize('admin'), deleteTutorial);

module.exports = router;
