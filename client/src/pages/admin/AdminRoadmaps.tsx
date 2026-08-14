import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, ChevronUp, ChevronDown, Link as LinkIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ResourceItem {
  title: string;
  url: string;
  type?: string;
}

interface StepItem {
  _id?: string;
  title: string;
  description: string;
  order: number;
  resources: ResourceItem[];
}

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  isPublished: boolean;
  steps: StepItem[];
}

const AdminRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    difficulty: string;
    estimatedDuration: string;
    isPublished: boolean;
    steps: StepItem[];
  }>({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    estimatedDuration: '3 months',
    isPublished: true,
    steps: []
  });

  useEffect(() => { fetchRoadmaps(); }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await api.get('/roadmaps/admin/all');
      setRoadmaps(data?.data || []);
    } catch (error) {
      try {
        const fallback = await api.get('/roadmaps');
        setRoadmaps(fallback?.data || []);
      } catch (err) {
        toast.error('Failed to fetch roadmaps');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (roadmap?: Roadmap) => {
    if (roadmap) {
      setSelectedRoadmap(roadmap);
      setFormData({
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        difficulty: roadmap.difficulty,
        estimatedDuration: roadmap.estimatedDuration || '',
        isPublished: roadmap.isPublished,
        steps: roadmap.steps ? JSON.parse(JSON.stringify(roadmap.steps)) : []
      });
    } else {
      setSelectedRoadmap(null);
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        difficulty: 'Beginner',
        estimatedDuration: '3 months',
        isPublished: true,
        steps: [
          {
            title: 'Web Fundamentals',
            description: 'HTML, CSS, JavaScript basics and how the web works.',
            order: 1,
            resources: []
          }
        ]
      });
    }
    setIsModalOpen(true);
  };

  // Step Management Handlers
  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: '',
          description: '',
          order: prev.steps.length + 1,
          resources: []
        }
      ]
    }));
  };

  const handleRemoveStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newSteps.length) return prev;
      
      const temp = newSteps[index];
      newSteps[index] = newSteps[targetIndex];
      newSteps[targetIndex] = temp;
      return { ...prev, steps: newSteps };
    });
  };

  // Resource Management inside Step
  const handleAddResource = (stepIndex: number) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      const currentResources = newSteps[stepIndex].resources || [];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        resources: [...currentResources, { title: '', url: '' }]
      };
      return { ...prev, steps: newSteps };
    });
  };

  const handleRemoveResource = (stepIndex: number, resourceIndex: number) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex].resources = newSteps[stepIndex].resources.filter((_, ri) => ri !== resourceIndex);
      return { ...prev, steps: newSteps };
    });
  };

  const handleResourceChange = (stepIndex: number, resourceIndex: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      const resources = [...newSteps[stepIndex].resources];
      resources[resourceIndex] = { ...resources[resourceIndex], [field]: value };
      newSteps[stepIndex].resources = resources;
      return { ...prev, steps: newSteps };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter roadmap title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter roadmap description');
      return;
    }

    setSubmitting(true);
    try {
      // Re-order steps cleanly (1, 2, 3...)
      const cleanedSteps = formData.steps.map((step, idx) => ({
        ...step,
        order: idx + 1,
        title: step.title.trim(),
        description: step.description.trim(),
        resources: (step.resources || []).filter(r => r.title.trim() && r.url.trim())
      }));

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        steps: cleanedSteps
      };

      if (selectedRoadmap) {
        await api.put(`/roadmaps/${selectedRoadmap._id}`, payload);
        toast.success('Roadmap updated successfully');
      } else {
        await api.post('/roadmaps', payload);
        toast.success('Roadmap created successfully');
      }
      setIsModalOpen(false);
      fetchRoadmaps();
    } catch (error: any) {
      console.error('Roadmap save error:', error);
      const msg = error?.message || error?.error || 'Failed to save roadmap';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoadmap) return;
    try {
      await api.delete(`/roadmaps/${selectedRoadmap._id}`);
      toast.success('Roadmap deleted successfully');
      setIsDeleteModalOpen(false);
      fetchRoadmaps();
    } catch (error) {
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Roadmaps Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create, update, and structure developer learning paths & steps.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm">
          <Plus size={18} /> Add Roadmap
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No roadmaps found.</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Total Steps</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {roadmaps.map((roadmap) => (
                <tr key={roadmap._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{roadmap.title}</td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{roadmap.category}</td>
                  <td className="p-4"><span className="badge-blue font-semibold">{roadmap.difficulty}</span></td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full font-mono text-xs font-bold">
                      {roadmap.steps?.length || 0} steps
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={roadmap.isPublished ? 'badge-primary' : 'badge-orange'}>
                      {roadmap.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(roadmap)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Roadmap">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedRoadmap(roadmap); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Roadmap">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal with Dynamic Steps Builder */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl flex flex-col rounded-2xl bg-white dark:bg-[#13111f] border border-slate-200 dark:border-purple-700/30 shadow-2xl"
              style={{ maxHeight: '88vh' }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                {/* Sticky Header */}
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedRoadmap ? 'Edit Roadmap' : 'Add New Roadmap'}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Structure developer learning paths & add steps</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
                  {/* Section 1: Basic Info */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider text-purple-400 font-bold">1. Basic Information</h3>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Roadmap Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="e.g. Full Stack Developer Complete Roadmap"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        className="input w-full text-sm resize-none"
                        style={{ height: '70px' }}
                        placeholder="Short summary of what students will learn..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Category <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          className="input w-full text-sm"
                          style={{ height: '40px' }}
                          placeholder="e.g. Full Stack, Frontend"
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
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">Est. Duration</label>
                        <input
                          type="text"
                          className="input w-full text-sm"
                          style={{ height: '40px' }}
                          placeholder="e.g. 3-6 months"
                          value={formData.estimatedDuration}
                          onChange={e => setFormData({ ...formData, estimatedDuration: e.target.value })}
                        />
                      </div>
                    </div>

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
                  </div>

                  {/* Section 2: Steps Builder */}
                  <div className="pt-3 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-purple-400 font-bold flex items-center gap-2">
                          2. Learning Path Steps
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] normal-case">
                            {formData.steps.length} {formData.steps.length === 1 ? 'step' : 'steps'}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Add topics and study resources for this roadmap</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add Step
                      </button>
                    </div>

                    {formData.steps.length === 0 ? (
                      <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-slate-400 text-xs">
                        No steps added yet. Click <strong>"+ Add Step"</strong> above to start building the learning path!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.steps.map((step, sIdx) => (
                          <div key={sIdx} className="p-3.5 bg-dark-900/90 border border-purple-500/20 rounded-xl space-y-3 relative">
                            {/* Step Header */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-mono text-[11px] flex items-center justify-center font-bold">
                                  {sIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-200">Step #{sIdx + 1}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={sIdx === 0}
                                  onClick={() => handleMoveStep(sIdx, 'up')}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                  <ChevronUp size={15} />
                                </button>
                                <button
                                  type="button"
                                  disabled={sIdx === formData.steps.length - 1}
                                  onClick={() => handleMoveStep(sIdx, 'down')}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                  <ChevronDown size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStep(sIdx)}
                                  className="p-1 text-red-400 hover:bg-red-500/10 rounded ml-1"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            {/* Step Inputs */}
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">Step Title <span className="text-red-400">*</span></label>
                                <input
                                  required
                                  type="text"
                                  placeholder="e.g. HTML5 & Semantic Web"
                                  className="input w-full text-xs"
                                  style={{ height: '36px' }}
                                  value={step.title}
                                  onChange={e => handleStepChange(sIdx, 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">Step Description</label>
                                <textarea
                                  placeholder="e.g. Tags, attributes, forms, accessibility..."
                                  className="input w-full text-xs resize-none"
                                  style={{ height: '54px' }}
                                  value={step.description}
                                  onChange={e => handleStepChange(sIdx, 'description', e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Nested Resources */}
                            <div className="pt-1">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                  <LinkIcon size={12} className="text-purple-400" /> Resources ({step.resources?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddResource(sIdx)}
                                  className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Resource
                                </button>
                              </div>

                              {step.resources && step.resources.length > 0 && (
                                <div className="space-y-1.5">
                                  {step.resources.map((resItem, rIdx) => (
                                    <div key={rIdx} className="flex gap-2 items-center">
                                      <input
                                        type="text"
                                        placeholder="Title (e.g. MDN Docs)"
                                        className="input text-xs py-1 px-2.5 flex-1"
                                        style={{ height: '32px' }}
                                        value={resItem.title}
                                        onChange={e => handleResourceChange(sIdx, rIdx, 'title', e.target.value)}
                                      />
                                      <input
                                        type="url"
                                        placeholder="URL (https://...)"
                                        className="input text-xs py-1 px-2.5 flex-1"
                                        style={{ height: '32px' }}
                                        value={resItem.url}
                                        onChange={e => handleResourceChange(sIdx, rIdx, 'url', e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveResource(sIdx, rIdx)}
                                        className="p-1 text-slate-500 hover:text-red-400"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <span>{submitting ? 'Saving...' : selectedRoadmap ? 'Update Roadmap' : 'Save Roadmap'}</span>
                  </button>
                </div>
              </form>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Roadmap?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete "{selectedRoadmap?.title}"? This action cannot be undone.</p>
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

export default AdminRoadmaps;
