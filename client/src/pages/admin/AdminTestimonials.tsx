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
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Testimonials</h1>
          <p className="text-slate-500 text-sm mt-0.5">Approve, manage, and feature student reviews.</p>
        </div>
        <select className="input w-44 bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 shadow-xs text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No testimonials found.</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={testimonial.avatar || 'https://via.placeholder.com/40'} alt="avatar" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-dark-700 object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-amber-500 font-bold text-base">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</td>
                  <td className="p-4 max-w-xs truncate text-slate-700 dark:text-slate-300 font-medium">{testimonial.message}</td>
                  <td className="p-4">
                    <span className={testimonial.approved ? 'badge-primary font-semibold' : 'badge-orange font-semibold'}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleApproveToggle(testimonial._id)} className={`p-2 rounded-lg transition-colors cursor-pointer ${testimonial.approved ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-400/10' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-400/10'}`} title={testimonial.approved ? "Revoke Approval" : "Approve"}>
                      {testimonial.approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button onClick={() => { setSelectedTestimonial(testimonial); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Testimonial">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Testimonial?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete the testimonial from {selectedTestimonial?.name}? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary cursor-pointer">Cancel</button>
                <button onClick={handleDelete} className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition cursor-pointer shadow-md">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
