import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ImageUploadInput from '../../components/admin/ImageUploadInput';

interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  isFree: boolean;
  thumbnail: string;
  instructor: {
    name: string;
    bio: string;
  };
  isPublished: boolean;
  studentsCount?: number;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const location = useLocation();
  const [formData, setFormData] = useState<{
    title: string; shortDescription: string; description: string; category: string;
    difficulty: string; price: number | string; isFree: boolean; thumbnail: string;
    instructorName: string; instructorBio: string; isPublished: boolean; duration: string;
  }>({
    title: '', shortDescription: '', description: '', category: 'React',
    difficulty: 'Beginner', price: '', isFree: true, thumbnail: '',
    instructorName: '', instructorBio: '', isPublished: false, duration: ''
  });

  useEffect(() => {
    fetchCourses();
    if ((location.state as any)?.openModal) {
      handleOpenModal();
    }
  }, [location.state]);

  const fetchCourses = async () => {
    try {
      const data: any = await api.get('/courses/admin/all');
      setCourses(data?.data || []);
    } catch (error: any) {
      console.error('Fetch courses error:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title || '',
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        category: course.category || 'React',
        difficulty: course.difficulty || 'Beginner',
        price: course.price ? course.price : '',
        isFree: course.isFree ?? true,
        thumbnail: course.thumbnail || '',
        duration: (course as any).duration || '',
        instructorName: course.instructor?.name || '',
        instructorBio: course.instructor?.bio || '',
        isPublished: course.isPublished ?? false
      });
    } else {
      setSelectedCourse(null);
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        category: 'React',
        difficulty: 'Beginner',
        price: '',
        isFree: true,
        thumbnail: '',
        instructorName: '',
        instructorBio: '',
        isPublished: true,
        duration: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter course title');
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error('Please enter a short description');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter course description');
      return;
    }
    if (!formData.thumbnail.trim()) {
      toast.error('Please upload or enter a course thumbnail');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        duration: formData.duration.trim(),
        isFree: formData.isFree,
        price: formData.isFree ? 0 : Math.max(0, Number(formData.price) || 0),
        thumbnail: formData.thumbnail.trim(),
        instructor: {
          name: formData.instructorName.trim(),
          bio: formData.instructorBio.trim()
        },
        isPublished: formData.isPublished
      };

      if (selectedCourse) {
        await api.put(`/courses/${selectedCourse._id}`, payload);
        toast.success('Course updated successfully');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error('Course save error:', error);
      const msg = error?.message || error?.error || 'Failed to save course';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      await api.delete(`/courses/${selectedCourse._id}`);
      toast.success('Course deleted successfully');
      setIsDeleteModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Courses</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage, create, and publish your course curriculum.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 cursor-pointer shadow-md text-sm">
          <Plus size={18} /> Create Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 shadow-sm font-medium">No courses found. Create one!</div>
      ) : (
        <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-gray-300">
            <thead className="bg-slate-100 dark:bg-gray-800/50 text-slate-800 dark:text-gray-200 font-bold border-b border-slate-200 dark:border-dark-700">
              <tr>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Free</th>
                <th className="p-4">Students</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <img src={course.thumbnail || '/logo.png'} alt="thumb" className="w-16 h-10 object-cover rounded-lg border border-slate-200 dark:border-dark-700" />
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{course.title}</td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{course.category}</td>
                  <td className="p-4 font-bold">{course.isFree ? <span className="badge-green">Free</span> : `₹${course.price}`}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-200">{course.students ?? (course as any).studentsCount ?? 0}</td>
                  <td className="p-4">
                    <span className={course.isPublished ? 'badge-primary' : 'badge-orange'}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(course)} className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-400/10 rounded-lg cursor-pointer transition-colors" title="Edit Course">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedCourse(course); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg cursor-pointer transition-colors" title="Delete Course">
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
                {/* Sticky Header */}
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedCourse ? 'Edit Course' : 'Create Course'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                  {/* Row 1: Title | Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="Course title..."
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <select
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="React">React</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value="MongoDB">MongoDB</option>
                        <option value="MERN">MERN</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="DSA">DSA</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Short Description */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Short Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full text-sm resize-none"
                      style={{ height: '75px' }}
                      placeholder="Brief overview of the course..."
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      className="input w-full text-sm resize-none"
                      style={{ height: '140px' }}
                      placeholder="Detailed course description..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Row 4: Thumbnail Upload & Difficulty */}
                  <div className="space-y-3">
                    <ImageUploadInput
                      label="Course Thumbnail"
                      required
                      value={formData.thumbnail}
                      onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                      folder="mohitdecodes/courses"
                      placeholder="https://... or upload from system"
                      aspectRatio="video"
                    />

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

                  {/* Row 5: Instructor Name | Instructor Bio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Instructor Name</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="Instructor name..."
                        value={formData.instructorName}
                        onChange={e => setFormData({ ...formData, instructorName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Instructor Bio</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="Instructor bio..."
                        value={formData.instructorBio}
                        onChange={e => setFormData({ ...formData, instructorBio: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 6: Duration | Is Free Course / Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Duration (e.g. "12 hours")</label>
                      <input
                        type="text"
                        className="input w-full text-sm"
                        style={{ height: '40px' }}
                        placeholder="e.g. 10 hours"
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none pt-2">
                        <input
                          type="checkbox"
                          checked={formData.isFree}
                          onChange={e => setFormData({ ...formData, isFree: e.target.checked })}
                          className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-300">Is Free Course</span>
                      </label>
                      {!formData.isFree && (
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 499"
                            className="input w-full text-sm"
                            style={{ height: '40px' }}
                            value={formData.price}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '' || Number(val) >= 0) {
                                setFormData({ ...formData, price: val });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 7: Publish Immediately */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
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
                    <span>{submitting ? 'Saving...' : selectedCourse ? 'Update Course' : 'Save Course'}</span>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Course?</h2>
              <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.</p>
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

export default AdminCourses;
