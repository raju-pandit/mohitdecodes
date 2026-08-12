import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  published: boolean;
}

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Cheat Sheet', fileUrl: '',
    fileType: 'PDF', fileSize: '', published: false
  });

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/api/resources/admin/all');
      setResources(data.data);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setSelectedResource(resource);
      setFormData({
        title: resource.title, description: resource.description,
        category: resource.category, fileUrl: resource.fileUrl,
        fileType: resource.fileType, fileSize: resource.fileSize,
        published: resource.published
      });
    } else {
      setSelectedResource(null);
      setFormData({
        title: '', description: '', category: 'Cheat Sheet', fileUrl: '',
        fileType: 'PDF', fileSize: '', published: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedResource) {
        await api.put(`/api/resources/${selectedResource._id}`, formData);
        toast.success('Resource updated successfully');
      } else {
        await api.post('/api/resources', formData);
        toast.success('Resource created successfully');
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (error) {
      toast.error('Failed to save resource');
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;
    try {
      await api.delete(`/api/resources/${selectedResource._id}`);
      toast.success('Resource deleted successfully');
      setIsDeleteModalOpen(false);
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Resources</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No resources found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type & Size</th>
                <th className="p-4">Downloads</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {resources.map((resource) => (
                <tr key={resource._id} className="hover:bg-gray-800/30">
                  <td className="p-4 font-medium text-white">{resource.title}</td>
                  <td className="p-4">{resource.category}</td>
                  <td className="p-4">
                    <span className="badge-blue">{resource.fileType}</span>
                    <span className="text-xs text-gray-500 ml-2">{resource.fileSize}</span>
                  </td>
                  <td className="p-4">{resource.downloads}</td>
                  <td className="p-4">
                    <span className={resource.published ? 'badge-primary' : 'badge-orange'}>
                      {resource.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(resource)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedResource(resource); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
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
                <h2 className="text-xl font-bold text-white">{selectedResource ? 'Edit Resource' : 'Add Resource'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Title</label>
                  <input required type="text" className="input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Description</label>
                  <textarea required className="input w-full h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Category</label>
                    <select className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="PDF">PDF</option>
                      <option value="Cheat Sheet">Cheat Sheet</option>
                      <option value="Notes">Notes</option>
                      <option value="Interview Questions">Interview Questions</option>
                      <option value="Roadmap">Roadmap</option>
                      <option value="Template">Template</option>
                      <option value="Coding Problems">Coding Problems</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">File Type</label>
                    <select className="input w-full" value={formData.fileType} onChange={e => setFormData({...formData, fileType: e.target.value})}>
                      <option>PDF</option><option>ZIP</option><option>DOCX</option><option>JPG</option><option>PNG</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">File URL</label>
                    <input required type="text" className="input w-full" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">File Size (e.g. '2.5 MB')</label>
                    <input required type="text" className="input w-full" value={formData.fileSize} onChange={e => setFormData({...formData, fileSize: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm text-gray-300 mt-2">
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-blue-500" />
                    <span>Published</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Resource</button>
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Resource?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.</p>
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

export default AdminResources;
