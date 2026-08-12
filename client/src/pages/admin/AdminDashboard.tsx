import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Download, Mail, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalBlogs: number;
  totalResources: number;
  totalSubscribers: number;
  newMessages: number;
}

const CountUp = ({ to }: { to: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) return;

    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;
    if(incrementTime < 10) incrementTime = 10;
    
    const step = Math.max(1, Math.floor(end / 100));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [to]);

  return <span>{count}</span>;
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Blogs', value: stats?.totalBlogs || 0, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Resources', value: stats?.totalResources || 0, icon: Download, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Mail, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'New Messages', value: stats?.newMessages || 0, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Create Course
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Plus size={18} /> Write Blog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">
                <CountUp to={stat.value} />
              </h3>
            </div>
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Recent Activity
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>No recent activity available.</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-white">
              <span className="flex items-center gap-3"><BookOpen size={18} className="text-purple-400" /> Manage Courses</span>
              <ArrowRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-white">
              <span className="flex items-center gap-3"><FileText size={18} className="text-green-400" /> Manage Blogs</span>
              <ArrowRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-white">
              <span className="flex items-center gap-3"><Download size={18} className="text-orange-400" /> Manage Resources</span>
              <ArrowRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
