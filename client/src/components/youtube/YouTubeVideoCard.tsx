import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, PlayCircle, Eye, Calendar, Clock } from 'lucide-react';
import { YouTubeVideo } from '../../services/youtubeService';

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
  isLatest?: boolean;
  index?: number;
  onSelect: (video: YouTubeVideo) => void;
}

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  video,
  isLatest = false,
  index = 0,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce hover preview to avoid iframe spamming on quick mouse traversal
  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      setIsPreviewActive(true);
    }, 280);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPreviewActive(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(video);
    }
  };

  // Muted, inline preview iframe with minimal UI
  const previewEmbedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${video.videoId}&enablejsapi=1`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      tabIndex={0}
      role="button"
      aria-label={`Play video: ${video.title}`}
      onClick={() => onSelect(video)}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-dark-900 border transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-xs hover:shadow-xl ${
        isHovered
          ? 'border-red-500/50 -translate-y-1.5 shadow-red-500/10'
          : 'border-slate-200/90 dark:border-dark-800'
      }`}
    >
      {/* Thumbnail / Video Preview Area (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full overflow-hidden bg-black shrink-0">
        {/* If hover preview is active, render lightweight preview player */}
        {isPreviewActive ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <iframe
              src={previewEmbedUrl}
              title={`Preview of ${video.title}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="w-full h-full border-0 pointer-events-none"
            />
            {/* Live Preview Indicator Badge */}
            <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur text-red-400 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              PREVIEW
            </div>
          </div>
        ) : (
          /* High-Resolution Thumbnail Image */
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        {/* Latest Badge */}
        {isLatest && !isPreviewActive && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-md z-10">
            LATEST
          </div>
        )}

        {/* YouTube Red Icon Watermark */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-600" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837z" />
            <polygon points="9.545 15.568 15.818 12 9.545 8.432" className="fill-white" />
          </svg>
        </div>

        {/* Hover Center Play Button Overlay (when not in preview mode) */}
        {!isPreviewActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform duration-200">
              <Play size={24} className="fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {!isPreviewActive && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md z-10 flex items-center gap-1">
            <Clock size={11} className="text-slate-300" />
            {video.durationFormatted}
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            title={video.title}
            className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug"
          >
            {video.title}
          </h3>

          {video.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Eye size={13} className="text-red-500" />
            {video.viewsFormatted} views
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {video.publishedAtRelative}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default YouTubeVideoCard;
