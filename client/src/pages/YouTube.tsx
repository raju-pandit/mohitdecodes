import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, PlayCircle, Users, Eye, Video, Loader2 } from 'lucide-react';
import api from '../services/api';
import useTitle from '../hooks/useTitle';
import toast from 'react-hot-toast';

interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  publishedAt: string;
  url: string;
}

interface YoutubeStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

const YouTubePage = () => {
  useTitle('YouTube Channel - MohitDecodes');
  
  const [stats, setStats] = useState<YoutubeStats>({
    subscriberCount: '15.4K',
    viewCount: '2.45M',
    videoCount: '85'
  });
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        const res = await api.get('/youtube');
        const responseData = res.data?.data || res.data || {};
        
        if (responseData.statistics) {
          const rawSubscribers = parseInt(responseData.statistics.subscriberCount || '15400');
          const rawViews = parseInt(responseData.statistics.viewCount || '2450000');
          
          setStats({
            subscriberCount: rawSubscribers >= 1000 ? `${(rawSubscribers / 1000).toFixed(1)}K` : `${rawSubscribers}`,
            viewCount: rawViews >= 1000000 ? `${(rawViews / 1000000).toFixed(2)}M` : `${(rawViews / 1000).toFixed(0)}K`,
            videoCount: responseData.statistics.videoCount || '85'
          });
        }
        
        if (responseData.videos) {
          setVideos(responseData.videos);
        }
      } catch (err) {
        console.error('Error fetching YouTube feeds:', err);
        toast.error('Failed to load live YouTube data. Showing cached feeds.');
      } finally {
        setLoading(false);
      }
    };

    fetchYoutubeData();
  }, []);

  const subscribeLink = 'https://www.youtube.com/@mohitdecodes?sub_confirmation=1';

  return (
    <div className="container-max py-12 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-950/20 to-dark-900 border border-red-900/30 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
              <Youtube size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              MohitDecodes <span className="text-red-500">YouTube</span>
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            Join thousands of developers learning full-stack development, systems design, and DSA for free on our YouTube channel. New tutorials uploaded weekly!
          </p>
          <a 
            href={subscribeLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary bg-red-600 hover:bg-red-700 py-3 px-8 rounded-full inline-flex items-center gap-2 font-bold text-lg border-none shadow-lg shadow-red-600/20"
          >
            Subscribe to Channel
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 w-full lg:w-auto">
          <div className="glass-card p-4 md:p-6 border border-dark-700 bg-dark-900/50 flex flex-col items-center justify-center text-center shrink-0 min-w-[100px] md:min-w-[140px]">
            <Users className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-xl md:text-2xl font-extrabold text-slate-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.subscriberCount}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Subscribers</span>
          </div>

          <div className="glass-card p-4 md:p-6 border border-dark-700 bg-dark-900/50 flex flex-col items-center justify-center text-center shrink-0 min-w-[100px] md:min-w-[140px]">
            <Eye className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-xl md:text-2xl font-extrabold text-slate-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.viewCount}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Total Views</span>
          </div>

          <div className="glass-card p-4 md:p-6 border border-dark-700 bg-dark-900/50 flex flex-col items-center justify-center text-center shrink-0 min-w-[100px] md:min-w-[140px]">
            <Video className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-xl md:text-2xl font-extrabold text-slate-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stats.videoCount}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Videos</span>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          Latest Video Uploads
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-video rounded-xl" />
                <div className="skeleton h-5 w-5/6 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid, i) => (
              <motion.div 
                key={vid.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group glass-card border border-dark-700/80 overflow-hidden hover:border-red-500/30 transition-all duration-300"
              >
                <a 
                  href={vid.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block relative aspect-video overflow-hidden"
                >
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle size={52} className="text-white drop-shadow-xl scale-95 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                    {vid.duration}
                  </div>
                </a>
                <div className="p-5 space-y-3">
                  <a 
                    href={vid.url}
                    target="_blank" 
                    rel="noopener noreferrer" 
                  >
                    <h3 className="font-bold text-slate-100 hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>
                  </a>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{vid.views}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <span>{vid.publishedAt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePage;
