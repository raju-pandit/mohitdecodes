import api from './api';

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscribers: number;
  subscribersFormatted: string;
  views: number;
  viewsFormatted: string;
  videoCount: number;
  url: string;
  customUrl?: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  durationFormatted: string;
  publishedAt: string;
  publishedAtRelative: string;
  views: number;
  viewsFormatted: string;
  youtubeUrl: string;
  embedUrl: string;
}

export interface YouTubeResponseData {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  cached?: boolean;
  cacheAgeMs?: number;
}

/**
 * Fetch full YouTube data (Channel statistics + latest 6 videos).
 * @param forceRefresh - If true, bypasses the backend cache and fetches fresh data from YouTube API.
 */
export const getYouTubeData = async (forceRefresh = false): Promise<YouTubeResponseData> => {
  const response = await api.get('/youtube', {
    params: forceRefresh ? { refresh: 'true' } : {}
  });
  return response.data?.data || response.data;
};

/**
 * Fetch channel statistics only.
 */
export const getYouTubeChannel = async (forceRefresh = false): Promise<YouTubeChannel> => {
  const response = await api.get('/youtube/channel', {
    params: forceRefresh ? { refresh: 'true' } : {}
  });
  return response.data?.data || response.data;
};

/**
 * Fetch latest 6 uploaded videos.
 */
export const getYouTubeVideos = async (forceRefresh = false): Promise<YouTubeVideo[]> => {
  const response = await api.get('/youtube/videos', {
    params: forceRefresh ? { refresh: 'true' } : {}
  });
  return response.data?.data || response.data;
};
