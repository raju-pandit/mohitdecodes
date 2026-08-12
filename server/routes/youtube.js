const express = require('express');
const router = express.Router();
const { getYoutubeStats } = require('../controllers/youtubeController');

router.get('/', getYoutubeStats);

module.exports = router;
