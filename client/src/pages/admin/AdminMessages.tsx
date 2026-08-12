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
      const { data } = await api.get('/api/contact');
      setMessages(data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/contact/${id}`, { status: newStatus });
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <select className="input w-40" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400 flex flex-col items-center">
          <MessageSquare size={48} className="mb-4 text-gray-600" />
          <p>No messages found in this category.</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredMessages.map((msg) => (
                <tr key={msg._id} className={`hover:bg-gray-800/30 cursor-pointer ${msg.status === 'new' ? 'bg-gray-800/20 font-medium' : ''}`} onClick={() => setSelectedMessage(msg)}>
                  <td className="p-4">
                    <p className="text-white">{msg.name}</p>
                    <p className="text-xs text-gray-500">{msg.email}</p>
                  </td>
                  <td className="p-4 truncate max-w-[200px]">{msg.subject}</td>
                  <td className="p-4">{getStatusBadge(msg.status)}</td>
                  <td className="p-4">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 p-2"><Eye size={18} /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-400">From: <span className="text-gray-300">{selectedMessage.name}</span> ({selectedMessage.email})</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-gray-300 whitespace-pre-wrap min-h-[150px]">
                {selectedMessage.message}
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-700/50 pt-4">
                <span className="text-sm text-gray-400">Update Status:</span>
                <div className="flex gap-2">
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'new')} className={`px-3 py-1 rounded text-sm ${selectedMessage.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>New</button>
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'read')} className={`px-3 py-1 rounded text-sm ${selectedMessage.status === 'read' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Read</button>
                  <button onClick={() => handleStatusChange(selectedMessage._id, 'resolved')} className={`px-3 py-1 rounded text-sm ${selectedMessage.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Resolved</button>
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
