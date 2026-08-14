import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, ExternalLink, Github, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
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
  const [submitting, setSubmitting] = useState(false);
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
      const data: any = await api.get('/projects');
      setProjects(data?.data || []);
    } catch (error: any) {
      console.error('Fetch projects error:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        technologies: project.technologies ? project.technologies.join(', ') : '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        difficulty: project.difficulty || 'Beginner',
        category: project.category || 'Frontend',
        featured: project.featured ?? false
      });
    } else {
      setSelectedProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        difficulty: 'Beginner',
        category: 'Frontend',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter project title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter project description');
      return;
    }
    if (!formData.image.trim()) {
      toast.error('Please upload or enter a project image');
      return;
    }
    if (!formData.technologies.trim()) {
      toast.error('Please enter technologies (comma separated)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: formData.githubUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
        difficulty: formData.difficulty,
        category: formData.category,
        featured: formData.featured
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
    } catch (error: any) {
      console.error('Project save error:', error);
      const msg = error?.message || error?.error || 'Failed to save project';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await api.delete(`/projects/${selectedProject._id}`);
      toast.success('Project deleted successfully');
      setIsDeleteModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">Showcase real-world portfolio projects for your community.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No projects found. Add one!</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Links</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    {project.image ? (
                      <img src={project.image} alt="project" className="w-16 h-10 object-cover rounded-lg border border-slate-200 dark:border-dark-700" />
                    ) : (
                      <div className="w-16 h-10 bg-slate-100 dark:bg-dark-800 rounded-lg flex items-center justify-center text-slate-400 text-xs border border-slate-200 dark:border-dark-700">No img</div>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{project.title}</td>
                  <td className="p-4"><span className="badge-blue">{project.category}</span></td>
                  <td className="p-4"><span className="badge-primary">{project.difficulty}</span></td>
                  <td className="p-4">
                    {project.featured ? (
                      <span className="badge-green">Featured</span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors" title="GitHub">
                          <Github size={16} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors" title="Live Demo">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(project)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Project">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedProject(project); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Project">
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
                    {selectedProject ? 'Edit Project' : 'Add Project'}
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
                      Project Title <span className="text-red-400">*</span>
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
                      style={{ height: '110px' }}
                      placeholder="Project description, features, architecture..."
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
                    placeholder="https://... or upload from system"
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
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <select
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Mobile">Mobile</option>
                        <option value="AI / ML">AI / ML</option>
                        <option value="Other">Other</option>
                      </select>
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

                  {/* Featured */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">Feature this project on homepage</span>
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
                    <span>{submitting ? 'Saving...' : selectedProject ? 'Update Project' : 'Save Project'}</span>
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
