import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, LifeBuoy, Send, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const BugReportFloating: React.FC = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<'bug' | 'support' | 'feedback'>('bug')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Only render for logged-in users
  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please enter your message')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/contact', {
        name: user.name,
        email: user.email,
        subject: `[Bug/Support - ${category.toUpperCase()}] Request from ${user.name}`,
        message: message
      })
      toast.success('Support request submitted successfully!')
      setMessage('')
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button Pinned on Right Edge */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-2.5 py-4 rounded-l-xl shadow-2xl flex flex-col items-center gap-3 transition-all duration-300 border-l border-y border-primary-500/20 group cursor-pointer"
      >
        <Bug className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-extrabold uppercase tracking-widest [writing-mode:vertical-lr] text-slate-100 select-none">
          Report Bug
        </span>
      </motion.button>

      {/* Slide-out Drawer / Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: '-45%', x: '50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '0%' }}
              exit={{ opacity: 0, scale: 0.95, y: '-45%', x: '50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-1/2 right-6 -translate-y-1/2 w-full max-w-sm bg-dark-900 border border-dark-700/80 rounded-2xl p-6 shadow-2xl z-50 space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-dark-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">Bug Report & Support</h3>
                    <p className="text-[10px] text-slate-500">Submit a quick support ticket.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="input py-2 px-3 text-xs bg-dark-950 border-dark-800"
                  >
                    <option value="bug">🐛 Report a Bug</option>
                    <option value="support">🔑 Account / Help</option>
                    <option value="feedback">💬 General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide a detailed description of the issue..."
                    rows={4}
                    className="input py-2 px-3 text-xs bg-dark-950 border-dark-800 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /> Submit Support Request</>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default BugReportFloating
