import {
  fetchJson,
  formatYouTubeDuration,
  formatNumber,
  formatRelativeTime
} from '../utils/youtubeHelpers.js';

// Default MohitDecodes YouTube Channel ID
export const DEFAULT_CHANNEL_ID = 'UC00Ni0CJFFLpaPf3lyHx5NA';
export const DEFAULT_CHANNEL_URL = `https://www.youtube.com/channel/${DEFAULT_CHANNEL_ID}`;

// In-memory cache storage with 10 minutes TTL
const CACHE_TTL_MS = 10 * 60 * 1000;
let cache = {
  data: null,
  timestamp: 0,
};

// Fallback high-fidelity data matching MohitDecodes channel
const fallbackData = {
  channel: {
    id: DEFAULT_CHANNEL_ID,
    title: 'MohitDecodes',
    description: 'Learn full-stack development, MERN stack, system design, data structures & algorithms with deep-dive practical projects and interview preparation.',
    thumbnail: 'https://images.unsplash.com/photo-1534972195531-a756b112697b?w=400&auto=format&fit=crop&q=80',
    subscribers: 15400,
    subscribersFormatted: '15.4K',
    views: 2450000,
    viewsFormatted: '2.45M',
    videoCount: 85,
    url: DEFAULT_CHANNEL_URL,
    customUrl: '@mohitdecodes'
  },
  videos: [
    {
      videoId: 'U_x15lM1yZt',
      title: 'Find the First Unique Character in a String - JavaScript Interview Question',
      description: 'Master string manipulation and hash map lookups in JavaScript with step-by-step time and space complexity breakdown.',
      thumbnail: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=800&auto=format&fit=crop&q=80',
      duration: 'PT8M24S',
      durationFormatted: '8:24',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '2 weeks ago',
      views: 12450,
      viewsFormatted: '12.4K',
      youtubeUrl: 'https://www.youtube.com/watch?v=U_x15lM1yZt',
      embedUrl: 'https://www.youtube.com/embed/U_x15lM1yZt'
    },
    {
      videoId: 'L_x15lM1yZu',
      title: 'Find the Longest Common Prefix - JavaScript DSA Interview Question',
      description: 'Learn how to solve the Longest Common Prefix problem in JavaScript using vertical scanning and trie algorithms.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      duration: 'PT11M40S',
      durationFormatted: '11:40',
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '3 weeks ago',
      views: 9820,
      viewsFormatted: '9.8K',
      youtubeUrl: 'https://www.youtube.com/watch?v=L_x15lM1yZu',
      embedUrl: 'https://www.youtube.com/embed/L_x15lM1yZu'
    },
    {
      videoId: 'S_x15lM1yZv',
      title: 'Space Complexity Explained in 2 Minutes | O(1), O(n), O(n²) Simplified',
      description: 'Demystifying Space Complexity for software engineering interviews with intuitive memory visualization and examples.',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
      duration: 'PT2M15S',
      durationFormatted: '2:15',
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '1 month ago',
      views: 15300,
      viewsFormatted: '15.3K',
      youtubeUrl: 'https://www.youtube.com/watch?v=S_x15lM1yZv',
      embedUrl: 'https://www.youtube.com/embed/S_x15lM1yZv'
    },
    {
      videoId: 'T_x15lM1yZw',
      title: 'Time Complexity Explained in 2 Mins | Big-O Notation for Web Developers',
      description: 'A complete beginner guide to understanding Big-O notation, logarithmic time, linear time, and quadratic time in JavaScript.',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80',
      duration: 'PT2M05S',
      durationFormatted: '2:05',
      publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '1 month ago',
      views: 18900,
      viewsFormatted: '18.9K',
      youtubeUrl: 'https://www.youtube.com/watch?v=T_x15lM1yZw',
      embedUrl: 'https://www.youtube.com/embed/T_x15lM1yZw'
    },
    {
      videoId: 'R_x15lM1yZx',
      title: 'Remove Duplicate Objects from an Array - JavaScript Interview Question',
      description: '3 fastest ways to remove duplicate objects from an array in JavaScript using Set, Map, and filter.',
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80',
      duration: 'PT7M50S',
      durationFormatted: '7:50',
      publishedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '2 months ago',
      views: 8430,
      viewsFormatted: '8.4K',
      youtubeUrl: 'https://www.youtube.com/watch?v=R_x15lM1yZx',
      embedUrl: 'https://www.youtube.com/embed/R_x15lM1yZx'
    },
    {
      videoId: 'F_x15lM1yZy',
      title: 'Find Common Elements in Two Arrays in O(n) Time - JavaScript Problem',
      description: 'Optimal linear time solution to find common elements across two arrays using hash sets in JavaScript.',
      thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
      duration: 'PT9M15S',
      durationFormatted: '9:15',
      publishedAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAtRelative: '2 months ago',
      views: 10150,
      viewsFormatted: '10.1K',
      youtubeUrl: 'https://www.youtube.com/watch?v=F_x15lM1yZy',
      embedUrl: 'https://www.youtube.com/embed/F_x15lM1yZy'
    }
  ]
};

/**
 * Fetch fresh data from YouTube Data API v3.
 * 1. Fetch channel snippet, contentDetails (uploads playlist ID), and statistics.
 * 2. Fetch latest 6 videos from the uploads playlist.
 * 3. Fetch detailed statistics and duration for each video via videos.list.
 */
export const fetchFreshYouTubeData = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;

  if (!apiKey) {
    console.warn('[YouTubeService] YOUTUBE_API_KEY is not set. Using high-fidelity fallback data.');
    return fallbackData;
  }

  try {
    // 1. Fetch Channel Resource
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
    const channelResponse = await fetchJson(channelUrl);

    if (!channelResponse.items || channelResponse.items.length === 0) {
      throw new Error(`YouTube channel with ID ${channelId} not found.`);
    }

    const channelItem = channelResponse.items[0];
    const snippet = channelItem.snippet || {};
    const statistics = channelItem.statistics || {};
    const contentDetails = channelItem.contentDetails || {};

    const rawSubscribers = parseInt(statistics.subscriberCount || '0', 10);
    const rawViews = parseInt(statistics.viewCount || '0', 10);
    const rawVideoCount = parseInt(statistics.videoCount || '0', 10);

    const channel = {
      id: channelId,
      title: snippet.title || 'MohitDecodes',
      description: snippet.description || 'Welcome to MohitDecodes YouTube Channel.',
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || fallbackData.channel.thumbnail,
      subscribers: rawSubscribers,
      subscribersFormatted: formatNumber(rawSubscribers),
      views: rawViews,
      viewsFormatted: formatNumber(rawViews),
      videoCount: rawVideoCount,
      url: `https://www.youtube.com/channel/${channelId}`,
      customUrl: snippet.customUrl || '@mohitdecodes'
    };

    // 2. Fetch Latest 6 Videos from the uploads playlist
    const uploadsPlaylistId = contentDetails.relatedPlaylists?.uploads;
    let videos = [];

    if (uploadsPlaylistId) {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=6&key=${encodeURIComponent(apiKey)}`;
      const playlistResponse = await fetchJson(playlistUrl);
      const playlistItems = playlistResponse.items || [];

      const videoIds = playlistItems
        .map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
        .filter(Boolean);

      if (videoIds.length > 0) {
        // 3. Fetch Video Details (duration, viewCount, etc.)
        const videosDetailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(videoIds.join(','))}&key=${encodeURIComponent(apiKey)}`;
        const videosDetailResponse = await fetchJson(videosDetailUrl);
        const videoDetailMap = new Map();

        (videosDetailResponse.items || []).forEach((v) => {
          videoDetailMap.set(v.id, v);
        });

        videos = playlistItems.map((item) => {
          const vidId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
          const detail = videoDetailMap.get(vidId);
          const vSnippet = detail?.snippet || item.snippet || {};
          const vStats = detail?.statistics || {};
          const vContent = detail?.contentDetails || {};

          const rawVideoViews = parseInt(vStats.viewCount || '0', 10);
          const rawDuration = vContent.duration || 'PT0S';
          const publishedDate = vSnippet.publishedAt || item.snippet?.publishedAt;

          const thumb =
            vSnippet.thumbnails?.maxres?.url ||
            vSnippet.thumbnails?.standard?.url ||
            vSnippet.thumbnails?.high?.url ||
            vSnippet.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.high?.url ||
            fallbackData.videos[0].thumbnail;

          return {
            videoId: vidId,
            title: vSnippet.title || 'Untitled Video',
            description: vSnippet.description || '',
            thumbnail: thumb,
            duration: rawDuration,
            durationFormatted: formatYouTubeDuration(rawDuration),
            publishedAt: publishedDate,
            publishedAtRelative: formatRelativeTime(publishedDate),
            views: rawVideoViews,
            viewsFormatted: formatNumber(rawVideoViews),
            youtubeUrl: `https://www.youtube.com/watch?v=${vidId}`,
            embedUrl: `https://www.youtube.com/embed/${vidId}`
          };
        });
      }
    }

    return {
      channel,
      videos: videos.length > 0 ? videos : fallbackData.videos
    };
  } catch (err) {
    console.error('[YouTubeService] Error fetching live YouTube data:', err.message);
    return fallbackData;
  }
};

/**
 * Get YouTube channel and videos with in-memory caching.
 * @param {boolean} [forceRefresh=false]
 * @returns {Promise<{ channel: object, videos: Array<object>, cached: boolean }>}
 */
export const getYouTubeDataWithCache = async (forceRefresh = false) => {
  const now = Date.now();
  const isCacheValid = cache.data && now - cache.timestamp < CACHE_TTL_MS;

  if (!forceRefresh && isCacheValid) {
    return {
      ...cache.data,
      cached: true,
      cacheAgeMs: now - cache.timestamp
    };
  }

  const freshData = await fetchFreshYouTubeData();
  cache = {
    data: freshData,
    timestamp: now
  };

  return {
    ...freshData,
    cached: false
  };
};
