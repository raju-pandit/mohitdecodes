import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Calendar, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { YouTubeVideo } from '../../services/youtubeService';

interface YouTubeVideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({ video, onClose }) => {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (video) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="youtube-modal-title"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-dark-800 bg-slate-50/80 dark:bg-dark-950/80 backdrop-blur shrink-0">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837z" />
                <polygon points="9.545 15.568 15.818 12 9.545 8.432" className="fill-white" />
              </svg>
              <span>MohitDecodes Video Player</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X size={20} />
            </button>
          </div>

          {/* Video Player Frame */}
          <div className="relative w-full aspect-video bg-black shrink-0">
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Video Metadata & Controls */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h2
                  id="youtube-modal-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug"
                >
                  {video.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                    <Eye size={15} className="text-red-500" />
                    {video.viewsFormatted} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={15} />
                    {video.publishedAtRelative}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={15} />
                    {video.durationFormatted}
                  </span>
                </div>
              </div>

              {/* Watch on YouTube Button */}
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-red-600 hover:bg-red-700 text-white py-2.5 px-5 rounded-xl font-bold text-sm inline-flex items-center gap-2 border-none shadow-md shadow-red-600/20 shrink-0 cursor-pointer self-start transition-transform transform hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837z" />
                  <polygon points="9.545 15.568 15.818 12 9.545 8.432" className="fill-white" />
                </svg>
                Watch on YouTube
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Video Description Accordion */}
            {video.description && (
              <div className="rounded-2xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950/60 p-4 transition-all">
                <div
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="flex items-center justify-between cursor-pointer select-none font-semibold text-xs text-slate-700 dark:text-slate-300"
                >
                  <span>Video Description</span>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                    {descriptionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <div
                  className={`mt-2 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed transition-all ${
                    descriptionExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {video.description}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default YouTubeVideoModal;
