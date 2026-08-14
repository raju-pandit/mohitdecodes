import { getYouTubeDataWithCache } from '../services/youtubeService.js';

// @desc    Get complete YouTube channel data and latest 6 videos
// @route   GET /api/youtube
// @access  Public
export const getYouTubeData = async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const result = await getYouTubeDataWithCache(forceRefresh);

    res.status(200).json({
      success: true,
      message: 'YouTube data retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get YouTube channel information & statistics
// @route   GET /api/youtube/channel
// @access  Public
export const getChannelInfo = async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const result = await getYouTubeDataWithCache(forceRefresh);

    res.status(200).json({
      success: true,
      message: 'YouTube channel info retrieved successfully',
      data: result.channel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest 6 uploaded YouTube videos
// @route   GET /api/youtube/videos
// @access  Public
export const getLatestVideos = async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const result = await getYouTubeDataWithCache(forceRefresh);

    res.status(200).json({
      success: true,
      message: 'YouTube videos retrieved successfully',
      data: result.videos
    });
  } catch (error) {
    next(error);
  }
};

// Backward-compatible alias
export const getYoutubeStats = getYouTubeData;
