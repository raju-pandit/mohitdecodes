import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import ImageUploadInput from '../../components/admin/ImageUploadInput';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  isPublished?: boolean;
  published?: boolean;
  createdAt?: string;
}

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cheat Sheet',
    fileUrl: '',
    fileType: 'PDF',
    fileSize: '',
    isPublished: true
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await api.get('/resources/admin/all');
      setResources(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setSelectedResource(resource);
      const isPub = resource.isPublished ?? resource.published ?? true;
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        category: resource.category || 'Cheat Sheet',
        fileUrl: resource.fileUrl || '',
        fileType: resource.fileType || 'PDF',
        fileSize: resource.fileSize || '',
        isPublished: isPub
      });
    } else {
      setSelectedResource(null);
      setFormData({
        title: '',
        description: '',
        category: 'Cheat Sheet',
        fileUrl: '',
        fileType: 'PDF',
        fileSize: '',
        isPublished: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
        fileSize: formData.fileSize || '1.0 MB',
        isPublished: formData.isPublished,
        published: formData.isPublished
      };

      if (selectedResource) {
        await api.put(`/resources/${selectedResource._id}`, payload);
        toast.success('Resource updated successfully!');
      } else {
        await api.post('/resources', payload);
        toast.success('Resource created successfully!');
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;
    try {
      await api.delete(`/resources/${selectedResource._id}`);
      toast.success('Resource deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchResources();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Resources</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage downloadable cheat sheets, PDFs, and assets.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No resources found.</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type & Size</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {resources.map((resource) => {
                const isPub = resource.isPublished ?? resource.published ?? true;
                return (
                  <tr key={resource._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{resource.title}</td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{resource.category}</td>
                    <td className="p-4">
                      <span className="badge-blue font-semibold">{resource.fileType}</span>
                      <span className="text-xs text-slate-500 ml-2 font-medium">{resource.fileSize}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-200">{resource.downloads || 0}</td>
                    <td className="p-4">
                      <span className={isPub ? 'badge-primary' : 'badge-orange'}>
                        {isPub ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{formatDate(resource.createdAt)}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleOpenModal(resource)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Resource">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { setSelectedResource(resource); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Resource">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
              className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-white dark:bg-[#13111f] border border-slate-200 dark:border-purple-700/30 shadow-2xl"
              style={{ maxHeight: '85vh' }}
            >
              {/* Sticky Header */}
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedResource ? 'Edit Resource' : 'Add Resource'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <form id="resource-form" onSubmit={handleSubmit} className="space-y-3">
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
                      placeholder="Resource title..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full text-sm resize-none"
                      style={{ height: '85px' }}
                      placeholder="Resource description..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Category | File Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <select
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Cheat Sheet">Cheat Sheet</option>
                        <option value="PDF">PDF</option>
                        <option value="Notes">Notes</option>
                        <option value="Interview Questions">Interview Questions</option>
                        <option value="Roadmap">Roadmap</option>
                        <option value="Template">Template</option>
                        <option value="Coding Problems">Coding Problems</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">File Type</label>
                      <select
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        value={formData.fileType}
                        onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                      >
                        <option value="PDF">PDF</option>
                        <option value="ZIP">ZIP</option>
                        <option value="DOCX">DOCX</option>
                        <option value="JPG">JPG</option>
                        <option value="PNG">PNG</option>
                      </select>
                    </div>
                  </div>

                  {/* File / Resource Upload */}
                  <ImageUploadInput
                    label="Resource File / Image URL"
                    required
                    value={formData.fileUrl}
                    onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                    folder="mohitdecodes/resources"
                    placeholder="https://... or upload from system"
                    aspectRatio="wide"
                  />

                  {/* File Size */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      File Size <span className="text-gray-500">(e.g. '2.5 MB')</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="input w-full text-sm"
                      style={{ height: '40px' }}
                      placeholder="e.g. 2.5 MB"
                      value={formData.fileSize}
                      onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                    />
                  </div>

                  {/* Published */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
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
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="resource-form"
                  disabled={submitting}
                  className="btn-primary text-sm px-5 py-2 flex items-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {selectedResource ? 'Update Resource' : 'Save Resource'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Resource?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.</p>
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

export default AdminResources;
