import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

interface Tutorial {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  difficulty: string;
  tags: string[];
  views: number;
  published: boolean;
  coverImage: string;
  createdAt: string;
}

const AdminTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: 'React',
    difficulty: 'Beginner', tags: '', published: false, coverImage: ''
  });

  useEffect(() => { fetchTutorials(); }, []);

  const fetchTutorials = async () => {
    try {
      const data = await api.get('/tutorials/admin/all');
      setTutorials(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tutorial?: Tutorial) => {
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setFormData({
        title: tutorial.title, excerpt: tutorial.excerpt, content: tutorial.content,
        category: tutorial.category, difficulty: tutorial.difficulty,
        tags: tutorial.tags.join(', '), published: tutorial.published, coverImage: tutorial.coverImage || ''
      });
    } else {
      setSelectedTutorial(null);
      setFormData({
        title: '', excerpt: '', content: '', category: 'React',
        difficulty: 'Beginner', tags: '', published: false, coverImage: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      if (selectedTutorial) {
        await api.put(`/tutorials/${selectedTutorial._id}`, payload);
        toast.success('Tutorial updated successfully');
      } else {
        await api.post('/tutorials', payload);
        toast.success('Tutorial created successfully');
      }
      setIsModalOpen(false);
      fetchTutorials();
    } catch (error) {
      toast.error('Failed to save tutorial');
    }
  };

  const handleDelete = async () => {
    if (!selectedTutorial) return;
    try {
      await api.delete(`/tutorials/${selectedTutorial._id}`);
      toast.success('Tutorial deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTutorials();
    } catch (error) {
      toast.error('Failed to delete tutorial');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Tutorials</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Tutorial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tutorials.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No tutorials found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Views</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {tutorials.map((tutorial) => (
                <tr key={tutorial._id} className="hover:bg-gray-800/30">
                  <td className="p-4 font-medium text-white max-w-xs truncate">{tutorial.title}</td>
                  <td className="p-4">{tutorial.category}</td>
                  <td className="p-4">
                    <span className="badge-blue">{tutorial.difficulty}</span>
                  </td>
                  <td className="p-4">{tutorial.views}</td>
                  <td className="p-4">
                    <span className={tutorial.published ? 'badge-primary' : 'badge-orange'}>
                      {tutorial.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">{formatDate(tutorial.createdAt)}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(tutorial)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedTutorial(tutorial); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl flex flex-col rounded-2xl border border-purple-700/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
              style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #13111f 100%)', maxHeight: '88vh' }}
            >
              {/* Sticky Header */}
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 flex-shrink-0">
                <h2 className="text-base font-bold text-white">
                  {selectedTutorial ? 'Edit Tutorial' : 'Add Tutorial'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <form id="tutorial-form" onSubmit={handleSubmit} className="space-y-3">
                  {/* Row 1: Title */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="input w-full text-sm"
                      style={{ height: '40px' }}
                      placeholder="Tutorial title..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* Row 2: Excerpt */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Excerpt <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full text-sm resize-none"
                      style={{ height: '70px' }}
                      placeholder="Short summary of the tutorial..."
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  {/* Row 3: Content */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Content <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full font-mono text-sm resize-y"
                      style={{ height: '160px' }}
                      placeholder="Write your tutorial content here (markdown supported)..."
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>

                  {/* Row 4: Category | Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <input
                        required
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="e.g. React, JavaScript, CSS..."
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Difficulty</label>
                      <select
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        value={formData.difficulty}
                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Cover Image URL | Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Cover Image URL</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="https://..."
                        value={formData.coverImage}
                        onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Tags <span className="text-gray-500">(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="react, hooks, state..."
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 6: Published Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={e => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                      <span className="text-sm text-gray-300">Publish immediately</span>
                    </label>
                  </div>
                </form>
              </div>

              {/* Sticky Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="tutorial-form"
                  className="btn-primary text-sm px-5 py-2"
                >
                  {selectedTutorial ? 'Update Tutorial' : 'Save Tutorial'}
                </button>
              </div>
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Tutorial?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedTutorial?.title}"? This action cannot be undone.</p>
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

export default AdminTutorials;
