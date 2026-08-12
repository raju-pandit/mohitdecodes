import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, X } from 'lucide-react'

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay before showing the banner for a premium feel
      const timer = setTimeout(() => {
        setVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 p-6 glass-card border border-dark-600/80 bg-dark-900/90 shadow-2xl flex flex-col gap-4 backdrop-blur-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold text-slate-100 flex items-center justify-between">
                Cookie & Privacy Consent
                <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We use cookies to personalize content, track course progression, and analyze our traffic to optimize your developer learning experience.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setVisible(false)}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 font-medium"
            >
              Declined
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary py-1.5 px-4 rounded-lg text-xs font-semibold"
            >
              Accept Cookies
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
