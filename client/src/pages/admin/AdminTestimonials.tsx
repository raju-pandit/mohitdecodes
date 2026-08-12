import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  avatar: string;
  approved: boolean;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await api.get('/testimonials/admin/all');
      setTestimonials(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveToggle = async (id: string) => {
    try {
      await api.put(`/testimonials/${id}/approve`);
      toast.success('Status updated');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    try {
      await api.delete(`/testimonials/${selectedTestimonial._id}`);
      toast.success('Testimonial deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Approved') return t.approved;
    if (filter === 'Pending') return !t.approved;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <select className="input w-40" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No testimonials found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-gray-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={testimonial.avatar || 'https://via.placeholder.com/40'} alt="avatar" className="w-10 h-10 rounded-full bg-gray-700" />
                      <div>
                        <p className="font-medium text-white">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-yellow-400">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</td>
                  <td className="p-4 max-w-xs truncate">{testimonial.message}</td>
                  <td className="p-4">
                    <span className={testimonial.approved ? 'badge-primary' : 'badge-orange'}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleApproveToggle(testimonial._id)} className={`p-2 rounded ${testimonial.approved ? 'text-orange-400 hover:bg-orange-400/10' : 'text-green-400 hover:bg-green-400/10'}`} title={testimonial.approved ? "Revoke Approval" : "Approve"}>
                      {testimonial.approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button onClick={() => { setSelectedTestimonial(testimonial); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Delete Testimonial?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete the testimonial from {selectedTestimonial?.name}? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
