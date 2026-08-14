import React from 'react';
import { Users, Eye, Video, ExternalLink, RefreshCw } from 'lucide-react';
import { YouTubeChannel } from '../../services/youtubeService';

interface YouTubeChannelHeaderProps {
  channel: YouTubeChannel | null;
  loading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export const YouTubeChannelHeader: React.FC<YouTubeChannelHeaderProps> = ({
  channel,
  loading,
  onRefresh,
  refreshing
}) => {
  const channelUrl = channel?.url || 'https://www.youtube.com/channel/UC00Ni0CJFFLpaPf3lyHx5NA';
  const subscribeUrl = `${channelUrl}?sub_confirmation=1`;

  const subscribers = channel?.subscribersFormatted || '15.4K';
  const views = channel?.viewsFormatted || '2.45M';
  const videoCount = channel?.videoCount ? `${channel.videoCount}` : '85';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-red-500/20 dark:border-red-900/30 bg-gradient-to-br from-red-500/5 via-white to-purple-500/5 dark:from-red-950/20 dark:via-dark-900 dark:to-dark-950 p-6 sm:p-8 md:p-12 shadow-sm transition-all">
      {/* Background Decorative Blur */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Column: Brand & Info */}
        <div className="space-y-6 text-center lg:text-left flex-1">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/25 overflow-hidden">
              {channel?.thumbnail ? (
                <img
                  src={channel.thumbnail}
                  alt={channel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837z" />
                  <polygon points="9.545 15.568 15.818 12 9.545 8.432" className="fill-white" />
                </svg>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 flex-wrap">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {channel?.title || 'MohitDecodes'} <span className="text-red-600 dark:text-red-500">YouTube</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                  LIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Learn • Build • Code • Grow with weekly full-stack tutorials
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
            {channel?.description ||
              'Join thousands of developers mastering modern web development, systems design, and DSA with step-by-step project-driven videos on YouTube.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-xl inline-flex items-center gap-2.5 font-bold text-base border-none shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.003 3.003 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.503 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837z" />
                <polygon points="9.545 15.568 15.818 12 9.545 8.432" className="fill-white" />
              </svg>
              Subscribe on YouTube
              <ExternalLink size={16} />
            </a>

            <button
              onClick={onRefresh}
              disabled={refreshing || loading}
              title="Refresh live YouTube stats"
              className="p-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-white/80 dark:bg-dark-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-purple-400 dark:hover:border-purple-500/40 transition-all cursor-pointer shadow-xs"
              aria-label="Refresh YouTube Data"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin text-purple-600' : ''} />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Statistics Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 w-full lg:w-auto shrink-0">
          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-dark-900/80 border border-slate-200/90 dark:border-dark-700 shadow-sm flex flex-col items-center justify-center text-center shrink-0 min-w-[95px] sm:min-w-[130px] transition-all duration-200 hover:border-red-500/30">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center mb-2.5 shadow-xs">
              <Users size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? <span className="animate-pulse">...</span> : subscribers}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Subscribers
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-dark-900/80 border border-slate-200/90 dark:border-dark-700 shadow-sm flex flex-col items-center justify-center text-center shrink-0 min-w-[95px] sm:min-w-[130px] transition-all duration-200 hover:border-red-500/30">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center mb-2.5 shadow-xs">
              <Eye size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? <span className="animate-pulse">...</span> : views}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Total Views
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-dark-900/80 border border-slate-200/90 dark:border-dark-700 shadow-sm flex flex-col items-center justify-center text-center shrink-0 min-w-[95px] sm:min-w-[130px] transition-all duration-200 hover:border-red-500/30">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center mb-2.5 shadow-xs">
              <Video size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? <span className="animate-pulse">...</span> : videoCount}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Videos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeChannelHeader;
