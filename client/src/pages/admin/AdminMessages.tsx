import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, AlertTriangle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.get('/contact');
      setMessages(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/contact/${id}`, { status: newStatus });
      toast.success('Message status updated');
      setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus as any } : m));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(m => filter === 'all' ? true : m.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="badge-red">New</span>;
      case 'read': return <span className="badge-blue">Read</span>;
      case 'resolved': return <span className="badge-green">Resolved</span>;
      default: return <span className="badge-orange">{status}</span>;
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="text-slate-500 text-sm mt-0.5">Read feedback, support requests, and user inquiries.</p>
        </div>
        <select className="input w-44 bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 shadow-xs text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm flex flex-col items-center">
          <MessageSquare size={48} className="mb-4 text-slate-400" />
          <p className="font-medium">No messages found in this category.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {filteredMessages.map((msg) => (
                <tr key={msg._id} className={`hover:bg-slate-50/80 dark:hover:bg-gray-800/30 cursor-pointer transition-colors ${msg.status === 'new' ? 'bg-purple-50/30 dark:bg-gray-800/20 font-medium' : ''}`} onClick={() => setSelectedMessage(msg)}>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{msg.name}</p>
                    <p className="text-xs text-slate-500">{msg.email}</p>
                  </td>
                  <td className="p-4 truncate max-w-[200px] text-slate-800 dark:text-slate-200 font-medium">{msg.subject}</td>
                  <td className="p-4">{getStatusBadge(msg.status)}</td>
                  <td className="p-4 text-slate-500 font-medium">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <button className="text-purple-600 hover:text-purple-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 cursor-pointer"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedMessage.subject}</h2>
                  <p className="text-sm text-slate-600 dark:text-gray-400">From: <span className="font-semibold text-slate-900 dark:text-gray-300">{selectedMessage.name}</span> ({selectedMessage.email})</p>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X size={24} /></button>
              </div>
              
              <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200/80 dark:border-transparent rounded-xl p-4 mb-6 text-slate-800 dark:text-gray-300 whitespace-pre-wrap min-h-[150px] leading-relaxed">
                {selectedMessage.message}
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-gray-700/50 pt-4">
                <span className="text-sm text-slate-600 dark:text-gray-400 font-medium">Update Status:</span>
                <div className="flex gap-2">
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'new')} className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${selectedMessage.status === 'new' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200'}`}>New</button>
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'read')} className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${selectedMessage.status === 'read' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200'}`}>Read</button>
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'resolved')} className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${selectedMessage.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200'}`}>Resolved</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
