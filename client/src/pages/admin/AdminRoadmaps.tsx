import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  isPublished: boolean;
  steps: any[];
}

const AdminRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Web Development',
    difficulty: 'Beginner', estimatedDuration: '', isPublished: false
  });

  useEffect(() => { fetchRoadmaps(); }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await api.get('/api/roadmaps');
      setRoadmaps(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (roadmap?: Roadmap) => {
    if (roadmap) {
      setSelectedRoadmap(roadmap);
      setFormData({
        title: roadmap.title, description: roadmap.description,
        category: roadmap.category, difficulty: roadmap.difficulty,
        estimatedDuration: roadmap.estimatedDuration || '', isPublished: roadmap.isPublished
      });
    } else {
      setSelectedRoadmap(null);
      setFormData({
        title: '', description: '', category: 'Web Development',
        difficulty: 'Beginner', estimatedDuration: '', isPublished: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRoadmap) {
        await api.put(`/api/roadmaps/${selectedRoadmap._id}`, formData);
        toast.success('Roadmap updated successfully');
      } else {
        await api.post('/api/roadmaps', formData);
        toast.success('Roadmap created successfully');
      }
      setIsModalOpen(false);
      fetchRoadmaps();
    } catch (error) {
      toast.error('Failed to save roadmap');
    }
  };

  const handleDelete = async () => {
    if (!selectedRoadmap) return;
    try {
      await api.delete(`/api/roadmaps/${selectedRoadmap._id}`);
      toast.success('Roadmap deleted successfully');
      setIsDeleteModalOpen(false);
      fetchRoadmaps();
    } catch (error) {
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Roadmaps</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Roadmap
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No roadmaps found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Steps</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {roadmaps.map((roadmap) => (
                <tr key={roadmap._id} className="hover:bg-gray-800/30">
                  <td className="p-4 font-medium text-white">{roadmap.title}</td>
                  <td className="p-4">{roadmap.category}</td>
                  <td className="p-4"><span className="badge-blue">{roadmap.difficulty}</span></td>
                  <td className="p-4">{roadmap.steps?.length || 0}</td>
                  <td className="p-4">
                    <span className={roadmap.isPublished ? 'badge-primary' : 'badge-orange'}>
                      {roadmap.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(roadmap)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedRoadmap(roadmap); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{selectedRoadmap ? 'Edit Roadmap' : 'Add Roadmap'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Title</label>
                  <input required type="text" className="input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Description</label>
                  <textarea required className="input w-full h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Category</label>
                    <input required type="text" className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Difficulty</label>
                    <select className="input w-full" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                      <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Est. Duration (e.g. '3 months')</label>
                    <input type="text" className="input w-full" value={formData.estimatedDuration} onChange={e => setFormData({...formData, estimatedDuration: e.target.value})} />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 text-sm text-gray-300 mt-6">
                      <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-blue-500" />
                      <span>Published</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Roadmap</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Delete Roadmap?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedRoadmap?.title}"? This action cannot be undone.</p>
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

export default AdminRoadmaps;
