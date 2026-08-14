import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getYouTubeData,
  YouTubeChannel,
  YouTubeVideo
} from '../../services/youtubeService';
import YouTubeChannelHeader from './YouTubeChannelHeader';
import YouTubeVideoGrid from './YouTubeVideoGrid';
import YouTubeVideoModal from './YouTubeVideoModal';
import YouTubeSkeleton from './YouTubeSkeleton';
import YouTubeErrorState from './YouTubeErrorState';

export const YouTubeSection: React.FC = () => {
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchContent = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await getYouTubeData(forceRefresh);
      if (data?.channel) {
        setChannel(data.channel);
      }
      if (data?.videos) {
        setVideos(data.videos);
      }
      if (forceRefresh) {
        toast.success('YouTube data refreshed live!');
      }
    } catch (err: any) {
      console.error('[YouTubeSection] Error fetching feeds:', err);
      setError(err?.message || 'Failed to load YouTube data');
      toast.error('Unable to fetch live YouTube data. Showing cached version.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContent(false);
  }, []);

  return (
    <div className="space-y-12">
      {/* Dynamic YouTube Channel Header Banner */}
      <YouTubeChannelHeader
        channel={channel}
        loading={loading}
        onRefresh={() => fetchContent(true)}
        refreshing={refreshing}
      />

      {/* Videos Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              Latest Video Uploads
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Hover over a card for instant preview, or click to watch on-site.
            </p>
          </div>
        </div>

        {/* Content Renderers */}
        {loading ? (
          <YouTubeSkeleton />
        ) : error && (!videos || videos.length === 0) ? (
          <YouTubeErrorState
            onRetry={() => fetchContent(true)}
            retrying={refreshing}
          />
        ) : (
          <YouTubeVideoGrid
            videos={videos}
            onSelectVideo={(video) => setSelectedVideo(video)}
          />
        )}
      </div>

      {/* Interactive Video Modal Player */}
      <YouTubeVideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};

export default YouTubeSection;
