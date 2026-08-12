import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  difficulty: string;
  category: string;
  featured: boolean;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', image: '', technologies: '',
    githubUrl: '', liveUrl: '', difficulty: 'Beginner', category: 'Frontend', featured: false
  });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.get('/projects');
      setProjects(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title, description: project.description,
        image: project.image, technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl, liveUrl: project.liveUrl,
        difficulty: project.difficulty, category: project.category, featured: project.featured
      });
    } else {
      setSelectedProject(null);
      setFormData({
        title: '', description: '', image: '', technologies: '',
        githubUrl: '', liveUrl: '', difficulty: 'Beginner', category: 'Frontend', featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      if (selectedProject) {
        await api.put(`/projects/${selectedProject._id}`, payload);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await api.delete(`/projects/${selectedProject._id}`);
      toast.success('Project deleted successfully');
      setIsDeleteModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No projects found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Tech (Top 3)</th>
                <th className="p-4">Links</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-800/30">
                  <td className="p-4">
                    <img src={project.image || 'https://via.placeholder.com/150'} alt="thumb" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium text-white">
                    {project.title} {project.featured && <span className="ml-2 badge-orange">Featured</span>}
                  </td>
                  <td className="p-4">{project.category}</td>
                  <td className="p-4"><span className="badge-blue">{project.difficulty}</span></td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-gray-700 text-xs">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>}
                    </div>
                  </td>
                  <td className="p-4 flex gap-2">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white"><Github size={16} /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><ExternalLink size={16} /></a>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(project)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { setSelectedProject(project); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-3xl my-8 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{selectedProject ? 'Edit Project' : 'Add Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Title</label>
                    <input required type="text" className="input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Description</label>
                    <textarea required className="input w-full h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Image URL</label>
                    <input required type="text" className="input w-full" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Technologies (comma separated)</label>
                    <input required type="text" className="input w-full" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">GitHub URL</label>
                    <input type="text" className="input w-full" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Live URL</label>
                    <input type="text" className="input w-full" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} />
                  </div>
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
                  <div className="md:col-span-2 mt-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-blue-500" />
                      <span>Featured Project</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Project</button>
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Project?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.</p>
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

export default AdminProjects;
