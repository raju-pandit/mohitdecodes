import React from 'react';
import { YouTubeVideo } from '../../services/youtubeService';
import YouTubeVideoCard from './YouTubeVideoCard';

interface YouTubeVideoGridProps {
  videos: YouTubeVideo[];
  onSelectVideo: (video: YouTubeVideo) => void;
}

export const YouTubeVideoGrid: React.FC<YouTubeVideoGridProps> = ({
  videos,
  onSelectVideo
}) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        No videos found. Check back soon for new uploads!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <YouTubeVideoCard
          key={video.videoId || index}
          video={video}
          index={index}
          isLatest={index === 0}
          onSelect={onSelectVideo}
        />
      ))}
    </div>
  );
};

export default YouTubeVideoGrid;
