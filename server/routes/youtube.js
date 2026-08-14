import express from 'express';
import {
  getYouTubeData,
  getChannelInfo,
  getLatestVideos
} from '../controllers/youtubeController.js';

const router = express.Router();

// GET /api/youtube - full channel & latest videos data
router.get('/', getYouTubeData);

// GET /api/youtube/channel - channel stats & details
router.get('/channel', getChannelInfo);

// GET /api/youtube/videos - latest 6 uploaded videos
router.get('/videos', getLatestVideos);

export default router;
