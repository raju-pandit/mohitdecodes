import React from 'react';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { DEFAULT_CHANNEL_URL } from '../../services/youtubeService';

interface YouTubeErrorStateProps {
  onRetry: () => void;
  retrying?: boolean;
}

export const YouTubeErrorState: React.FC<YouTubeErrorStateProps> = ({ onRetry, retrying = false }) => {
  return (
    <div className="text-center py-16 px-6 bg-white dark:bg-dark-900/40 rounded-3xl border border-red-200 dark:border-red-900/30 max-w-xl mx-auto shadow-sm space-y-6">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle size={32} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Unable to Load Latest Videos
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          We encountered an issue communicating with the YouTube Data API. Please check your network connection or try again in a moment.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          disabled={retrying}
          className="btn-primary py-2.5 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw size={16} className={retrying ? 'animate-spin' : ''} />
          {retrying ? 'Retrying...' : 'Retry'}
        </button>

        <a
          href="https://www.youtube.com/channel/UC00Ni0CJFFLpaPf3lyHx5NA"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary py-2.5 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 border border-slate-200 dark:border-dark-700 hover:border-red-500/40 cursor-pointer shadow-xs"
        >
          <ExternalLink size={16} className="text-red-500" />
          Visit YouTube Channel
        </a>
      </div>
    </div>
  );
};

export default YouTubeErrorState;
