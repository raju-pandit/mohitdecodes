import React from 'react';

export const GenericSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-dark-800 ${className}`}></div>
);

export const CourseCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dark-800 bg-dark-900/50 p-4">
      <GenericSkeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        <GenericSkeleton className="h-5 w-24 rounded-full" />
        <GenericSkeleton className="h-6 w-full" />
        <GenericSkeleton className="h-6 w-4/5" />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <GenericSkeleton className="h-8 w-8 rounded-full" />
            <GenericSkeleton className="h-4 w-20" />
          </div>
          <GenericSkeleton className="h-4 w-16" />
        </div>
        <div className="mt-4 border-t border-dark-800 pt-4 flex justify-between items-center">
          <GenericSkeleton className="h-6 w-16" />
          <GenericSkeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dark-800 bg-dark-900/50 p-4">
      <GenericSkeleton className="aspect-[16/9] w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <GenericSkeleton className="h-5 w-16 rounded-full" />
        </div>
        <GenericSkeleton className="h-7 w-full" />
        <GenericSkeleton className="h-4 w-full" />
        <GenericSkeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-3 mt-2">
          <GenericSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <GenericSkeleton className="h-4 w-24" />
            <GenericSkeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TutorialCardSkeleton = () => {
  return (
    <div className="flex gap-4 rounded-xl border border-dark-800 bg-dark-900/50 p-4 items-center">
      <GenericSkeleton className="h-16 w-16 rounded-lg shrink-0" />
      <div className="flex flex-col gap-2 flex-grow">
        <GenericSkeleton className="h-5 w-3/4" />
        <GenericSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};
