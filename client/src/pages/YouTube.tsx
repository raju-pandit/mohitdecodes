import React from 'react';
import useTitle from '../hooks/useTitle';
import YouTubeSection from '../components/youtube/YouTubeSection';

const YouTubePage: React.FC = () => {
  useTitle('YouTube Channel - MohitDecodes');

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <YouTubeSection />
      </div>
    </div>
  );
};

export default YouTubePage;
