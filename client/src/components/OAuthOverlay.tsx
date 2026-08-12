import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Globe } from 'lucide-react'

interface OAuthOverlayProps {
  isOpen: boolean
  onClose: () => void
  provider: 'google' | 'github' | null
  onSelectAccount: (name: string, email: string, avatar: string) => void
}

const OAuthOverlay: React.FC<OAuthOverlayProps> = ({ isOpen, onClose, provider, onSelectAccount }) => {
  if (!provider) return null

  const isGoogle = provider === 'google'

  const accounts = isGoogle
    ? [
        {
          name: 'Mohit Decodes',
          email: 'mohitdecodes.dev@gmail.com',
          avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit+Decodes&size=100'
        },
        {
          name: 'Rahul Kumar',
          email: 'rahul@example.com',
          avatar: 'https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=Rahul+Kumar&size=100'
        }
      ]
    : [
        {
          name: 'mohitdjcet',
          email: 'mohitdjcet@users.noreply.github.com',
          avatar: 'https://avatars.githubusercontent.com/u/1024000?v=4' // standard github style avatar
        },
        {
          name: 'dev-rahul',
          email: 'rahul.dev@github.com',
          avatar: 'https://ui-avatars.com/api/?background=1f2937&color=fff&name=Rahul+Dev&size=100'
        }
      ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] cursor-pointer"
          />

          {/* Modal Overlay Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-[101] text-zinc-100 space-y-5"
          >
            {/* Logo and Close */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isGoogle ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.478-10-10-10z" />
                  </svg>
                )}
                <span className="text-xs text-zinc-400 font-medium">
                  {isGoogle ? 'accounts.google.com' : 'github.com/login'}
                </span>
              </div>
              <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Header Title */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-1.5">
                Sign in with {isGoogle ? 'Google' : 'GitHub'}
              </h2>
              <p className="text-xs text-zinc-400">
                to continue to <span className="text-primary-400 font-semibold">MohitDecodes</span>
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2.5">
              {accounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectAccount(acc.name, acc.email, acc.avatar)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border border-zinc-700/50" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white">{acc.name}</h4>
                      <p className="text-[10px] text-zinc-500">{acc.email}</p>
                    </div>
                  </div>
                  <Globe className="w-3.5 h-3.5 text-zinc-600 group-hover:text-primary-400 transition-colors" />
                </button>
              ))}

              <button
                onClick={() => onSelectAccount(isGoogle ? 'New Google User' : 'New GitHub User', `new.${provider}.${Date.now()}@example.com`, '')}
                className="w-full p-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 text-center text-xs text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
              >
                + Use another account
              </button>
            </div>

            {/* Footer Trust Info */}
            <div className="pt-3 border-t border-zinc-900 flex items-start gap-2 text-[10px] text-zinc-500 leading-normal">
              <Shield className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
              <p>
                To continue, the provider will share your secure profile name, verified email address, and avatar with MohitDecodes.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OAuthOverlay
