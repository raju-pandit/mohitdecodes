import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Sparkles, MessageSquare, CheckCircle2, UserCheck } from 'lucide-react';

interface TopmateCardProps {
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
}

export const TopmateCard: React.FC<TopmateCardProps> = ({ className = '', variant = 'card' }) => {
  const topmateUrl = 'https://topmate.io/mohitdecodes';

  const handleClick = () => {
    window.open(topmateUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group p-4 rounded-2xl bg-white dark:bg-dark-900 border border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
            T
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Connect on Topmate
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                1:1 Call
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Career Guidance & Mock Interviews</p>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
          <ExternalLink size={16} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/40 to-white dark:from-dark-900 dark:via-purple-950/20 dark:to-dark-950 border border-purple-200/80 dark:border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        {/* Top Badges & Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-500/25 shrink-0 select-none">
              T
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  TOPMATE.IO
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  Verified Mentor
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mt-0.5">
                Connect with me on Topmate
              </h3>
            </div>
          </div>
        </div>

        {/* Description & Feature Pills */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Get direct, personalized 1:1 guidance on Full-Stack development, portfolio & resume feedback, career roadmaps, and mock technical interviews.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300 font-semibold">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>1:1 Mentorship Call</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Resume & Portfolio Review</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Mock Technical Interview</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>Custom Career Roadmap</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            className="w-full sm:w-auto btn-primary py-3 px-7 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white shadow-lg shadow-purple-600/25 border-none cursor-pointer group-hover:scale-[1.02] transition-all"
          >
            <Calendar size={16} />
            <span>Visit Topmate</span>
            <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopmateCard;
