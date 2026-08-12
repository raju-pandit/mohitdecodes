import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, ChevronUp, ChevronDown, Link as LinkIcon } from 'lucide-react';
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
      const data = await api.get('/roadmaps');
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
      const msg = error?.message || error?.error || 'Failed to save roadmap';
      toast.error(msg);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Roadmaps Management</h1>
          <p className="text-sm text-slate-400">Create, update, and structure developer learning paths & steps</p>
        </div>
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
                <th className="p-4">Total Steps</th>
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
                  <td className="p-4"><span className="px-2.5 py-1 bg-dark-800 rounded-full font-mono text-xs">{roadmap.steps?.length || 0} steps</span></td>
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

      {/* Form Modal with Dynamic Steps Builder */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-3xl p-6 my-8 max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-700/60 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedRoadmap ? 'Edit Roadmap' : 'Add New Roadmap'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Fill details and build learning path steps</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/40"><X size={20} /></button>
              </div>

              {/* Form Content - Scrollable */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider text-primary-400 font-bold">1. Basic Information</h3>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-300">Roadmap Title *</label>
                    <input required type="text" placeholder="e.g. Full Stack Developer Complete Roadmap" className="input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-300">Description *</label>
                    <textarea required placeholder="Short summary of what students will learn in this roadmap..." className="input w-full h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-300">Category *</label>
                      <input required type="text" placeholder="e.g. Web Development / Full Stack / Backend" className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-300">Difficulty</label>
                      <select className="input w-full" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-300">Est. Duration</label>
                      <input type="text" placeholder="e.g. 3-6 months" className="input w-full" value={formData.estimatedDuration} onChange={e => setFormData({...formData, estimatedDuration: e.target.value})} />
                    </div>
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer select-none">
                      <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-primary-500 w-4 h-4" />
                      <span>Publish immediately</span>
                    </label>
                  </div>
                </div>

                {/* Section 2: Steps Builder */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-primary-400 font-bold">2. Learning Path Steps ({formData.steps.length})</h3>
                      <p className="text-[11px] text-slate-400">Add sequential topics and resources for this roadmap</p>
                    </div>
                    <button type="button" onClick={handleAddStep} className="px-3 py-1.5 bg-primary-600/30 border border-primary-500/40 text-primary-300 hover:bg-primary-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5">
                      <Plus size={14} /> Add Step
                    </button>
                  </div>

                  {formData.steps.length === 0 ? (
                    <div className="p-6 border border-dashed border-gray-700 rounded-xl text-center text-slate-400 text-xs">
                      No steps added yet. Click <strong>"+ Add Step"</strong> above to start building the learning path!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.steps.map((step, sIdx) => (
                        <div key={sIdx} className="p-4 bg-dark-900/80 border border-gray-800 rounded-xl space-y-3 relative group">
                          {/* Step Header Bar */}
                          <div className="flex justify-between items-center border-b border-gray-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary-600/30 border border-primary-500/40 text-primary-300 font-mono text-xs flex items-center justify-center font-bold">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-200">Step #{sIdx + 1}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button type="button" disabled={sIdx === 0} onClick={() => handleMoveStep(sIdx, 'up')} className="p-1 text-slate-400 hover:text-white disabled:opacity-30">
                                <ChevronUp size={16} />
                              </button>
                              <button type="button" disabled={sIdx === formData.steps.length - 1} onClick={() => handleMoveStep(sIdx, 'down')} className="p-1 text-slate-400 hover:text-white disabled:opacity-30">
                                <ChevronDown size={16} />
                              </button>
                              <button type="button" onClick={() => handleRemoveStep(sIdx)} className="p-1 text-red-400 hover:bg-red-500/10 rounded ml-2">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Step Inputs */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Step Title *</label>
                              <input required type="text" placeholder="e.g. JavaScript ES6+ & Async Programming" className="input w-full text-xs" value={step.title} onChange={e => handleStepChange(sIdx, 'title', e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Step Description</label>
                              <textarea placeholder="e.g. Closures, promises, async/await, DOM manipulation..." className="input w-full text-xs h-16" value={step.description} onChange={e => handleStepChange(sIdx, 'description', e.target.value)}></textarea>
                            </div>
                          </div>

                          {/* Nested Recommended Resources */}
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                <LinkIcon size={12} className="text-slate-500" /> Recommended Resources ({step.resources?.length || 0})
                              </span>
                              <button type="button" onClick={() => handleAddResource(sIdx)} className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1">
                                <Plus size={12} /> Add Resource
                              </button>
                            </div>

                            {step.resources && step.resources.length > 0 && (
                              <div className="space-y-2">
                                {step.resources.map((resItem, rIdx) => (
                                  <div key={rIdx} className="flex gap-2 items-center">
                                    <input type="text" placeholder="Resource Title (e.g. MDN Docs)" className="input text-xs py-1 px-2.5 flex-1" value={resItem.title} onChange={e => handleResourceChange(sIdx, rIdx, 'title', e.target.value)} />
                                    <input type="url" placeholder="URL (e.g. https://...)" className="input text-xs py-1 px-2.5 flex-1" value={resItem.url} onChange={e => handleResourceChange(sIdx, rIdx, 'url', e.target.value)} />
                                    <button type="button" onClick={() => handleRemoveResource(sIdx, rIdx)} className="p-1 text-slate-500 hover:text-red-400">
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

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 shrink-0">
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
