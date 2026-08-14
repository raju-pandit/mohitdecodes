import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import ImageUploadInput from '../../components/admin/ImageUploadInput';

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
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: 'React',
    difficulty: 'Beginner', tags: '', published: true, coverImage: ''
  });

  useEffect(() => { fetchTutorials(); }, []);

  const fetchTutorials = async () => {
    try {
      const data: any = await api.get('/tutorials/admin/all');
      setTutorials(data?.data || []);
    } catch (error: any) {
      console.error('Fetch tutorials error:', error);
      toast.error('Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tutorial?: Tutorial) => {
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setFormData({
        title: tutorial.title || '',
        excerpt: tutorial.excerpt || '',
        content: tutorial.content || '',
        category: tutorial.category || 'React',
        difficulty: tutorial.difficulty || 'Beginner',
        tags: tutorial.tags ? tutorial.tags.join(', ') : '',
        published: tutorial.published ?? false,
        coverImage: tutorial.coverImage || ''
      });
    } else {
      setSelectedTutorial(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'React',
        difficulty: 'Beginner',
        tags: '',
        published: true,
        coverImage: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter tutorial title');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Please enter tutorial excerpt');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter tutorial content');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category.trim(),
        difficulty: formData.difficulty,
        coverImage: formData.coverImage.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        published: formData.published
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
    } catch (error: any) {
      console.error('Tutorial save error:', error);
      const msg = error?.message || error?.error || 'Failed to save tutorial';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTutorial) return;
    try {
      await api.delete(`/tutorials/${selectedTutorial._id}`);
      toast.success('Tutorial deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTutorials();
    } catch (error: any) {
      toast.error('Failed to delete tutorial');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Tutorials</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage step-by-step programming guides and learning paths.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm">
          <Plus size={18} /> Create Tutorial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tutorials.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No tutorials found. Create one!</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
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
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {tutorials.map((tutorial) => (
                <tr key={tutorial._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-[220px] truncate">{tutorial.title}</td>
                  <td className="p-4"><span className="badge-blue">{tutorial.category}</span></td>
                  <td className="p-4"><span className="badge-primary">{tutorial.difficulty}</span></td>
                  <td className="p-4 text-slate-600 dark:text-gray-400">{tutorial.views || 0}</td>
                  <td className="p-4">
                    <span className={tutorial.published ? 'badge-primary' : 'badge-orange'}>
                      {tutorial.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-gray-400 whitespace-nowrap">{formatDate(tutorial.createdAt)}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(tutorial)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Tutorial">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedTutorial(tutorial); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Tutorial">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl flex flex-col rounded-2xl bg-white dark:bg-[#13111f] border border-slate-200 dark:border-purple-700/30 shadow-2xl overflow-hidden"
              style={{ maxHeight: '88vh' }}
            >
              {/* Form wrapping entire modal */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedTutorial ? 'Edit Tutorial' : 'Create Tutorial'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                  {/* Title */}
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

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Excerpt <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full text-sm resize-none"
                      style={{ height: '72px' }}
                      placeholder="Short overview of what learners will build/understand..."
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Content (Markdown) <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full font-mono text-sm resize-none"
                      style={{ height: '175px' }}
                      placeholder="Write your tutorial markdown steps, code blocks, explanations..."
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>

                  {/* Category | Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <input
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

                  {/* Cover Image Upload */}
                  <ImageUploadInput
                    label="Tutorial Cover Image"
                    value={formData.coverImage}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    folder="mohitdecodes/tutorials"
                    placeholder="https://... or upload from system"
                    aspectRatio="video"
                  />

                  {/* Tags */}
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

                  {/* Published */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={e => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">Publish immediately</span>
                    </label>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-white/5 flex-shrink-0 bg-slate-50 dark:bg-[#13111f]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary text-sm px-4 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-sm px-6 py-2 rounded-xl font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={15} className="animate-spin" />}
                    <span>{submitting ? 'Saving...' : selectedTutorial ? 'Update Tutorial' : 'Save Tutorial'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Tutorial?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete "{selectedTutorial?.title}"? This action cannot be undone.</p>
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

export default AdminTutorials;
