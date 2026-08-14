import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
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
        if (isMounted && cards && cards.length > 0) {
          // Find first active card
          const activeCard = cards.find(c => c.status === 'active') || cards[0];
          setCard(activeCard);
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

  // If card status is inactive, do not render on frontend
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

  // Compact Variant (used in sidebars / contact list)
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group p-4 rounded-2xl bg-white dark:bg-dark-900 border border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 overflow-hidden shrink-0 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <img
              src={displayImage}
              alt={title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {badge}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                {title}
              </h4>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 shadow-xs">
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    );
  }

  // Full Promotional Card
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white via-purple-50/40 to-white dark:from-dark-900 dark:via-purple-950/20 dark:to-dark-950 border border-purple-200/80 dark:border-purple-500/30 hover:border-purple-500 shadow-sm hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 cursor-pointer select-none ${className}`}
    >
      {/* Subtle ambient glow effects */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/15 dark:bg-purple-500/25 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
        {/* Left Area: Cloudinary Image + Badge + Title + Description */}
        <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
          {/* Fixed aspect ratio rounded image with zoom on hover */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-purple-300/40 dark:border-purple-500/30 overflow-hidden shrink-0 shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            <img
              src={displayImage}
              alt={title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            {/* Small Category / Badge Text */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                {badge}
              </span>
            </div>

            {/* Admin-Controlled Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
              {title}
            </h3>

            {/* Admin-Controlled Short Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Right Area: CTA Button with Moving Arrow */}
        <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base py-3.5 px-7 rounded-2xl shadow-lg shadow-purple-600/30 border-none transition-all duration-300 transform group-hover:scale-105 active:scale-98 cursor-pointer"
          >
            <span>{buttonText}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopmateCard;
