import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

interface Subscriber {
  _id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await api.get('/newsletter/subscribers');
      setSubscribers(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['Email,Status,Subscribed Date'];
    const csvData = subscribers.map(s => `${s.email},${s.subscribed ? 'Active' : 'Unsubscribed'},${new Date(s.createdAt).toISOString()}`);
    const blob = new Blob([headers.concat(csvData).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'newsletter_subscribers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('CSV exported');
  };

  const filteredSubscribers = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center justify-between col-span-1 md:col-span-1">
          <div>
            <p className="text-gray-400 mb-1">Total Subscribers</p>
            <h3 className="text-3xl font-bold text-white">{subscribers.filter(s => s.subscribed).length}</h3>
          </div>
          <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-500">
            <Mail size={24} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search email..." 
            className="input w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2 whitespace-nowrap w-full sm:w-auto">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredSubscribers.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">No subscribers found.</td></tr>
              ) : filteredSubscribers.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-800/30">
                  <td className="p-4 font-medium text-white">{sub.email}</td>
                  <td className="p-4">
                    {sub.subscribed ? <span className="badge-primary">Active</span> : <span className="badge-red">Unsubscribed</span>}
                  </td>
                  <td className="p-4">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
