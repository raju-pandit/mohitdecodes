import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { TopmateCard as TopmateCardType } from '../types';
import { getPublicTopmateCards, DEFAULT_TOPMATE_URL } from '../services/topmateService';

interface TopmateCardProps {
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
  cardData?: TopmateCardType;
}

export const TopmateCard: React.FC<TopmateCardProps> = ({
  className = '',
  variant = 'card',
  cardData
}) => {
  const [card, setCard] = useState<TopmateCardType | null>(cardData || null);
  const [loading, setLoading] = useState(!cardData);

  useEffect(() => {
    if (cardData) {
      setCard(cardData);
      return;
    }

    let isMounted = true;
    const fetchActiveCard = async () => {
      try {
        const cards = await getPublicTopmateCards();
        if (isMounted && cards && cards.length > 0) {
          setCard(cards[0]);
        }
      } catch (err) {
        console.error('Failed to load Topmate card:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActiveCard();
    return () => {
      isMounted = false;
    };
  }, [cardData]);

  const targetUrl = card?.url || DEFAULT_TOPMATE_URL;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const title = card?.title || 'Connect with Mohit';
  const description =
    card?.description ||
    'Book a 1:1 session, consultation or connect with me directly for career guidance, code reviews, and mock technical interviews.';
  const category = card?.category || 'TOPMATE';
  const badge = card?.badge || 'Book a Session';
  const buttonText = card?.buttonText || 'Book on Topmate';
  const image = card?.image || '/logo.png';

  // Compact Variant (e.g., used in sidebars / contact page)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group p-4 rounded-2xl bg-white dark:bg-dark-900 border border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 overflow-hidden shrink-0 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-lg">
                T
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                {title}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 shadow-xs">
          <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    );
  }

  // Full Promotional / Card Variant
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white via-purple-50/40 to-white dark:from-dark-900 dark:via-purple-950/20 dark:to-dark-950 border border-purple-200/80 dark:border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 cursor-pointer select-none ${className}`}
    >
      {/* Ambient background glow on hover */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/15 dark:bg-purple-500/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
        {/* Left Column: Image + Content */}
        <div className="flex items-start gap-5 flex-1 min-w-0">
          {/* Card Image */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-purple-300/40 dark:border-purple-500/30 overflow-hidden shrink-0 shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform duration-300">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl">
                T
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
                {category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                {badge}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Right Column: CTA Button with Circular Arrow */}
        <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base py-3.5 px-7 rounded-2xl shadow-lg shadow-purple-600/30 border-none transition-all duration-300 transform group-hover:scale-105 active:scale-98 cursor-pointer"
          >
            <span>{buttonText}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopmateCard;
