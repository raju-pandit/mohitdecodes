import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (cardData) {
      setCard(cardData);
      return;
    }

    let isMounted = true;
    const fetchActiveCard = async () => {
      try {
        const cards = await getPublicTopmateCards();
        if (isMounted && Array.isArray(cards) && cards.length > 0) {
          const activeCard = cards.find(c => c.status === 'active') || cards[0];
          if (activeCard) {
            setCard(activeCard);
          }
        }
      } catch (err) {
        console.error('Failed to load Topmate card from backend:', err);
      }
    };

    fetchActiveCard();
    return () => {
      isMounted = false;
    };
  }, [cardData]);

  // If card is explicitly inactive, hide
  if (card && card.status === 'inactive') {
    return null;
  }

  const targetUrl = card?.url || DEFAULT_TOPMATE_URL;
  const title = card?.title || 'Developer Roadmap & Career Guidance';
  const description =
    card?.description ||
    'Book a 1:1 mentorship session and get personalized guidance for your developer career.';
  const badge = card?.badge || 'TOPMATE';
  const buttonText = card?.buttonText || 'Book on Topmate';
  const rawImage = card?.imageUrl || card?.image || '/logo.png';
  const displayImage = imageError ? '/logo.png' : rawImage;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Compact Variant (Used in sidebars / contact lists)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group p-4 rounded-2xl bg-white dark:bg-dark-900 border border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            style={{ width: '52px', height: '52px', minWidth: '52px', maxWidth: '52px', minHeight: '52px', maxHeight: '52px' }}
            className="rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 overflow-hidden shrink-0 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
          >
            <img
              src={displayImage}
              alt={title}
              loading="lazy"
              onError={() => setImageError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="min-w-0">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              {badge}
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate mt-0.5">
              {title}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-dark-800 text-white flex items-center justify-center group-hover:bg-purple-600 transition-all shrink-0 shadow-xs">
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    );
  }

  // EXACT REFERENCE CARD DESIGN (Full prominent photo on top, content in middle, CTA + circular arrow on bottom, NO PRICE)
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 hover:border-purple-500/80 shadow-md hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${className}`}
    >
      {/* 1. TOP PROMINENT COVER PHOTO (Exact Reference Style) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-slate-100 dark:bg-dark-800 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Live Topmate Session Pill */}
        <div className="absolute top-3.5 right-3.5">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>1:1 Session</span>
          </span>
        </div>
      </div>

      {/* 2. MIDDLE CONTENT SECTION */}
      <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col justify-start">
        {/* Category / Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {badge || 'TOPMATE'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* 3. BOTTOM ACTION BAR (Price completely removed as requested, with Button text + Circular Arrow Button) */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between bg-slate-50/50 dark:bg-dark-950/40">
        <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {buttonText || 'Book on Topmate'}
        </span>

        <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-dark-800 text-white flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-rose-600 group-hover:scale-110 shadow-md transition-all duration-300 shrink-0">
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default TopmateCard;
