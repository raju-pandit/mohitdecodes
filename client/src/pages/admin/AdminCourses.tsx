import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', description: '', category: 'React',
    difficulty: 'Beginner', price: 0, isFree: true, thumbnail: '',
    instructorName: '', instructorBio: '', isPublished: false
  });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/api/courses/admin/all');
      setCourses(data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title, shortDescription: course.shortDescription, description: course.description,
        category: course.category, difficulty: course.difficulty, price: course.price,
        isFree: course.isFree, thumbnail: course.thumbnail,
        instructorName: course.instructor?.name || '', instructorBio: course.instructor?.bio || '',
        isPublished: course.isPublished
      });
    } else {
      setSelectedCourse(null);
      setFormData({
        title: '', shortDescription: '', description: '', category: 'React',
        difficulty: 'Beginner', price: 0, isFree: true, thumbnail: '',
        instructorName: '', instructorBio: '', isPublished: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        instructor: { name: formData.instructorName, bio: formData.instructorBio }
      };
      
      if (selectedCourse) {
        await api.put(`/api/courses/${selectedCourse._id}`, payload);
        toast.success('Course updated successfully');
      } else {
        await api.post('/api/courses', payload);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      await api.delete(`/api/courses/${selectedCourse._id}`);
      toast.success('Course deleted successfully');
      setIsDeleteModalOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No courses found. Create one!</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
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
            <tbody className="divide-y divide-gray-700/50">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-800/30">
                  <td className="p-4">
                    <img src={course.thumbnail} alt="thumb" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium text-white">{course.title}</td>
                  <td className="p-4">{course.category}</td>
                  <td className="p-4">{course.isFree ? <span className="badge-green">Free</span> : `$${course.price}`}</td>
                  <td className="p-4">{course.studentsCount || 0}</td>
                  <td className="p-4">
                    <span className={course.isPublished ? 'badge-primary' : 'badge-orange'}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(course)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedCourse(course); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-3xl my-8 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{selectedCourse ? 'Edit Course' : 'Create Course'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Title</label>
                    <input required type="text" className="input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Category</label>
                    <select className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
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
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Short Description</label>
                    <input required type="text" className="input w-full" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Description</label>
                    <textarea required className="input w-full h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Thumbnail URL</label>
                    <input required type="text" className="input w-full" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Difficulty</label>
                    <select className="input w-full" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                      <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Instructor Name</label>
                    <input type="text" className="input w-full" value={formData.instructorName} onChange={e => setFormData({...formData, instructorName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Instructor Bio</label>
                    <input type="text" className="input w-full" value={formData.instructorBio} onChange={e => setFormData({...formData, instructorBio: e.target.value})} />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm text-gray-300 mt-6">
                      <input type="checkbox" checked={formData.isFree} onChange={e => setFormData({...formData, isFree: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-blue-500" />
                      <span>Is Free Course</span>
                    </label>
                  </div>
                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Price ($)</label>
                      <input type="number" className="input w-full" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                  )}
                  <div className="md:col-span-2 mt-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded bg-gray-700 border-gray-600 text-blue-500" />
                      <span>Publish immediately</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Course</button>
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Course?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.</p>
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

export default AdminCourses;
