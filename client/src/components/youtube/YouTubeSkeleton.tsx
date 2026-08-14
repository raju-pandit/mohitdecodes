import React from 'react';

export const YouTubeSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200/90 dark:border-dark-800 bg-white dark:bg-dark-900 overflow-hidden shadow-sm flex flex-col animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="aspect-video w-full bg-slate-200 dark:bg-dark-800 relative">
            <div className="absolute bottom-3 right-3 w-12 h-5 bg-slate-300 dark:bg-dark-700 rounded" />
          </div>

          {/* Body Skeleton */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-dark-800 rounded-md w-full" />
              <div className="h-5 bg-slate-200 dark:bg-dark-800 rounded-md w-3/4" />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YouTubeSkeleton;
