import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] min-h-[95vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-dark-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] ${sizes[size]}`}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || typeof onClose === 'function') && (
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-dark-800">
                  {title && (
                    <div className="text-xl font-semibold text-slate-900 dark:text-white">
                      {title}
                    </div>
                  )}
                  {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose} className="!px-2 !py-2 rounded-full -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
              <div className="p-6 overflow-y-auto text-slate-800 dark:text-slate-200">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
