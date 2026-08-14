import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ImageUploadInput from '../../components/admin/ImageUploadInput';

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
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage full-stack projects and showcase repositories.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No projects found.</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
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
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <img src={project.image || 'https://via.placeholder.com/150'} alt="thumb" className="w-16 h-10 object-cover rounded-lg border border-slate-200 dark:border-dark-700" />
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {project.title} {project.featured && <span className="ml-2 badge-orange font-semibold">Featured</span>}
                  </td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{project.category}</td>
                  <td className="p-4"><span className="badge-blue font-semibold">{project.difficulty}</span></td>
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-transparent text-xs font-medium">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && <span className="text-xs text-slate-400 font-medium">+{project.technologies.length - 3}</span>}
                    </div>
                  </td>
                  <td className="p-4 flex gap-3 items-center">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Github size={16} /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"><ExternalLink size={16} /></a>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(project)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Project">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { setSelectedProject(project); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Project">
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl flex flex-col rounded-2xl bg-white dark:bg-[#13111f] border border-slate-200 dark:border-purple-700/30 shadow-2xl"
              style={{ maxHeight: '85vh' }}
            >
              {/* Sticky Header */}
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedProject ? 'Edit Project' : 'Add Project'}
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
                <form id="project-form" onSubmit={handleSubmit} className="space-y-3">
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
                      placeholder="Project title..."
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
                      placeholder="Short description of the project..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Image Upload with Cloud Storage */}
                  <ImageUploadInput
                    label="Project Image"
                    required
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="mohitdecodes/projects"
                    placeholder="https://... or click Upload Image"
                    aspectRatio="video"
                  />

                  {/* Technologies */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Technologies <span className="text-gray-500">(comma separated)</span> <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="input w-full text-sm"
                      style={{ height: '40px' }}
                      placeholder="React, Node.js, MongoDB, Tailwind..."
                      value={formData.technologies}
                      onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                    />
                  </div>

                  {/* GitHub URL | Live URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">GitHub URL</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="https://github.com/..."
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Live URL</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="https://..."
                        value={formData.liveUrl}
                        onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Category | Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="e.g. Frontend, MERN, Full Stack..."
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

                  {/* Featured Project */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                      <span className="text-sm text-gray-300">Featured Project</span>
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
                  form="project-form"
                  className="btn-primary text-sm px-5 py-2"
                >
                  {selectedProject ? 'Update Project' : 'Save Project'}
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Project?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.</p>
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

export default AdminProjects;
