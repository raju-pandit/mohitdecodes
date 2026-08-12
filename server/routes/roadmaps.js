const express = require('express');
const router = express.Router();
const { getRoadmaps, getRoadmap, createRoadmap, updateRoadmap, deleteRoadmap, updateProgress } = require('../controllers/roadmapController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRoadmaps);
router.get('/:slug', (req, res, next) => {
  // Optionally pass user if logged in
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  if (authHeader || cookieToken) {
    protect(req, res, () => getRoadmap(req, res, next));
  } else {
    getRoadmap(req, res, next);
  }
});
router.post('/', protect, authorize('admin'), createRoadmap);
router.put('/:id', protect, authorize('admin'), updateRoadmap);
router.delete('/:id', protect, authorize('admin'), deleteRoadmap);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;
