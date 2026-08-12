import express from 'express';
const router = express.Router();
import { getYoutubeStats } from '../controllers/youtubeController.js';

router.get('/', getYoutubeStats);

export default router;
