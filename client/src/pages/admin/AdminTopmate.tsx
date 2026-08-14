import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TopmateCard } from '../../types';
import {
  getAdminTopmateCards,
  createTopmateCard,
  updateTopmateCard,
  deleteTopmateCard,
  toggleTopmateStatus,
  uploadTopmateImage,
  DEFAULT_TOPMATE_URL
} from '../../services/topmateService';

export const AdminTopmate: React.FC = () => {
  const [cards, setCards] = useState<TopmateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TopmateCard | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Connect with Mohit',
    category: 'TOPMATE',
    description: 'Book a 1:1 session, consultation or connect with me directly for career roadmaps and code reviews.',
    badge: '1:1 Session Available',
    buttonText: 'Book on Topmate',
    url: DEFAULT_TOPMATE_URL,
    status: 'active' as 'active' | 'inactive',
    displayOrder: 0,
    image: '/logo.png'
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await getAdminTopmateCards();
      setCards(data);
    } catch (error) {
      toast.error('Failed to load Topmate cards');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (card?: TopmateCard) => {
    if (card) {
      setSelectedCard(card);
      setFormData({
        title: card.title || '',
        category: card.category || 'TOPMATE',
        description: card.description || '',
        badge: card.badge || 'Available',
        buttonText: card.buttonText || 'Book on Topmate',
        url: card.url || DEFAULT_TOPMATE_URL,
        status: card.status || 'active',
        displayOrder: card.displayOrder || 0,
        image: card.image || '/logo.png'
      });
    } else {
      setSelectedCard(null);
      setFormData({
        title: 'Connect with Mohit',
        category: 'TOPMATE',
        description: 'Book a 1:1 session, consultation or connect with me directly for career roadmaps and code reviews.',
        badge: '1:1 Session Available',
        buttonText: 'Book on Topmate',
        url: DEFAULT_TOPMATE_URL,
        status: 'active',
        displayOrder: cards.length,
        image: '/logo.png'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadTopmateImage(file);
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. You can also paste an image URL.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a card description');
      return;
    }

    try {
      if (selectedCard) {
        await updateTopmateCard(selectedCard._id, formData);
        toast.success('Topmate card updated successfully!');
      } else {
        await createTopmateCard(formData);
        toast.success('Topmate card created successfully!');
      }
      handleCloseModal();
      fetchCards();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save Topmate card');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleTopmateStatus(id);
      toast.success(`Card ${currentStatus === 'active' ? 'Deactivated' : 'Activated'}`);
      fetchCards();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedCard) return;
    try {
      await deleteTopmateCard(selectedCard._id);
      toast.success('Topmate card deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedCard(null);
      fetchCards();
    } catch (error) {
      toast.error('Failed to delete Topmate card');
    }
  };

  return (
    <div className="p-2 sm:p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-dark-700 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Topmate Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-500/15 to-purple-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              1:1 Mentorship
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Manage public Topmate cards, promotional banners, badges, and session URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={DEFAULT_TOPMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs px-3.5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            <span>Preview Profile</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={() => handleOpenModal()}
            className="btn-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Topmate Card</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-dark-900 rounded-3xl border border-dashed border-slate-300 dark:border-dark-700 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl font-black">
            T
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Topmate Cards Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Create your first promotional card to showcase your 1:1 mentorship, guidance, and portfolio reviews on the website.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary text-sm px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create First Card</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards List Table */}
          <div className="bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-dark-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Configured Topmate Cards ({cards.length})
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Active cards are dynamically fetched by the website
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-dark-950/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-dark-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Card / Thumbnail</th>
                    <th className="p-4">Badge & Category</th>
                    <th className="p-4">Destination Link</th>
                    <th className="p-4 text-center">Order</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-800/80">
                  {cards.map((card) => (
                    <tr
                      key={card._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-dark-800/40 transition-colors"
                    >
                      {/* Title & Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 overflow-hidden shrink-0 flex items-center justify-center">
                            {card.image ? (
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-base">
                                T
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Badge & Category */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                            {card.badge || 'Available'}
                          </span>
                          <p className="text-[11px] font-mono text-slate-400">
                            {card.category || 'TOPMATE'}
                          </p>
                        </div>
                      </td>

                      {/* Destination Link */}
                      <td className="p-4">
                        <a
                          href={card.url || DEFAULT_TOPMATE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline max-w-[200px] truncate"
                        >
                          <LinkIcon size={12} className="shrink-0" />
                          <span className="truncate">{card.url || DEFAULT_TOPMATE_URL}</span>
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      </td>

                      {/* Display Order */}
                      <td className="p-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {card.displayOrder}
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(card._id, card.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            card.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200'
                              : 'bg-slate-200 dark:bg-dark-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-dark-700 hover:bg-slate-300'
                          }`}
                        >
                          {card.status === 'active' ? (
                            <>
                              <CheckCircle2 size={13} className="text-emerald-500" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={13} className="text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(card)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all cursor-pointer"
                            title="Edit Card"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCard(card);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between bg-slate-50 dark:bg-dark-950/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {selectedCard ? 'Edit Topmate Card' : 'Create Topmate Card'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Live Card Preview Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Live Public Preview
                  </label>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-dark-950 dark:via-dark-900 dark:to-purple-950/20 border border-purple-300/60 dark:border-purple-500/30 shadow-sm relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-xl">
                            T
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                            {formData.category || 'TOPMATE'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                            {formData.badge || 'Available'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {formData.title || 'Card Title'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {formData.description || 'Card description appears here...'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-dark-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        {formData.buttonText || 'Book on Topmate'}
                        <ArrowRight size={14} />
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                        {formData.url || DEFAULT_TOPMATE_URL}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Card Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Connect with Mohit"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="input w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Category Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TOPMATE or 1:1 CALL"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="input w-full text-sm font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly explain what learners will get from this session..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="input w-full text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Book a Session, 1:1 Call"
                      value={formData.badge}
                      onChange={e => setFormData({ ...formData, badge: e.target.value })}
                      className="input w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Book on Topmate"
                      value={formData.buttonText}
                      onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                      className="input w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Topmate URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://topmate.io/mohitdecodes"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    className="input w-full text-sm font-mono"
                  />
                </div>

                {/* Image Upload & URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Card Image / Avatar
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Image URL or upload file below..."
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="input flex-1 w-full text-sm"
                    />

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-outline text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Upload size={14} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                      className="input w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="input w-full text-sm"
                    >
                      <option value="active">Active (Visible on Site)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-dark-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline text-sm px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-sm px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-600/20 cursor-pointer"
                  >
                    {selectedCard ? 'Save Changes' : 'Create Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Topmate Card?</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{selectedCard?.title}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn-outline text-sm px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 cursor-pointer transition-all"
                >
                  Delete Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTopmate;
