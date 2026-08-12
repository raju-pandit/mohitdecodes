import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  views: number;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', coverImage: '', category: 'Tech',
    tags: '', published: false, seoTitle: '', seoDescription: ''
  });

  useEffect(() => {
    fetchBlogs();
    if ((location.state as any)?.openModal) {
      handleOpenModal();
    }
  }, [location.state]);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs/admin/all');
      setBlogs(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        title: blog.title, excerpt: blog.excerpt, content: blog.content,
        coverImage: blog.coverImage, category: blog.category, tags: blog.tags.join(', '),
        published: blog.published, seoTitle: blog.seoTitle || '', seoDescription: blog.seoDescription || ''
      });
    } else {
      setSelectedBlog(null);
      setFormData({
        title: '', excerpt: '', content: '', coverImage: '', category: 'Tech',
        tags: '', published: false, seoTitle: '', seoDescription: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      if (selectedBlog) {
        await api.put(`/blogs/${selectedBlog._id}`, payload);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', payload);
        toast.success('Blog created successfully');
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to save blog');
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    try {
      await api.delete(`/blogs/${selectedBlog._id}`);
      toast.success('Blog deleted successfully');
      setIsDeleteModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blogs</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Write Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-400">No blogs found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-gray-200">
              <tr>
                <th className="p-4">Cover</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Views</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-800/30">
                  <td className="p-4">
                    <img src={blog.coverImage || 'https://via.placeholder.com/150'} alt="cover" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium text-white max-w-xs truncate">{blog.title}</td>
                  <td className="p-4">{blog.category}</td>
                  <td className="p-4">{blog.views}</td>
                  <td className="p-4">
                    <span className={blog.published ? 'badge-primary' : 'badge-orange'}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(blog)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedBlog(blog); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── WRITE / EDIT BLOG MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl flex flex-col rounded-2xl border border-purple-700/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
              style={{ background: 'linear-gradient(135deg,#0f0f1a 0%,#13111f 100%)', maxHeight: '85vh' }}
            >
              {/* Sticky Header */}
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 flex-shrink-0">
                <h2 className="text-base font-bold text-white">
                  {selectedBlog ? 'Edit Blog' : 'Write Blog'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition">
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-3">

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input required type="text"
                      className="input w-full text-sm" style={{ height: '40px' }}
                      placeholder="Blog title..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Excerpt <span className="text-red-400">*</span>
                    </label>
                    <textarea required
                      className="input w-full text-sm resize-none"
                      style={{ height: '72px' }}
                      placeholder="Short description of the blog..."
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">
                      Content (Markdown/HTML) <span className="text-red-400">*</span>
                    </label>
                    <textarea required
                      className="input w-full font-mono text-sm resize-none"
                      style={{ height: '190px' }}
                      placeholder="Write your blog content in markdown or HTML..."
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })} />
                  </div>

                  {/* Row: Cover Image | Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Cover Image URL</label>
                      <input type="text"
                        className="input w-full text-sm" style={{ height: '40px' }}
                        placeholder="https://..."
                        value={formData.coverImage}
                        onChange={e => setFormData({ ...formData, coverImage: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">Category</label>
                      <input type="text"
                        className="input w-full text-sm" style={{ height: '40px' }}
                        placeholder="e.g. Tech, React, Career..."
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    </div>
                  </div>

                  {/* Row: Tags | SEO Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">
                        Tags <span className="text-gray-600">(comma separated)</span>
                      </label>
                      <input type="text"
                        className="input w-full text-sm" style={{ height: '40px' }}
                        placeholder="react, javascript, web..."
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">SEO Title</label>
                      <input type="text"
                        className="input w-full text-sm" style={{ height: '40px' }}
                        placeholder="SEO optimized title..."
                        value={formData.seoTitle}
                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} />
                    </div>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">SEO Description</label>
                    <input type="text"
                      className="input w-full text-sm" style={{ height: '40px' }}
                      placeholder="Meta description for search engines..."
                      value={formData.seoDescription}
                      onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} />
                  </div>

                  {/* Published */}
                  <label className="flex items-center gap-2 cursor-pointer select-none w-fit py-1">
                    <input type="checkbox"
                      checked={formData.published}
                      onChange={e => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-sm text-gray-300">Publish immediately</span>
                  </label>

                </form>
              </div>

              {/* Sticky Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/5 flex-shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-sm px-4 py-2">
                  Cancel
                </button>
                <button type="submit" form="blog-form"
                  className="btn-primary text-sm px-5 py-2">
                  {selectedBlog ? 'Update Blog' : 'Save Blog'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM MODAL ── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Delete Blog?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.</p>
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

export default AdminBlogs;
