import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  to?: string;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = "" }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-[10px] bg-[#090d16] border border-primary-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] transition-all duration-200 hover:scale-105 hover:border-primary-400/60 hover:shadow-[0_0_16px_rgba(168,85,247,0.35)] ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Bold geometric M & D monogram in pure solid white */}
        <g fill="#FFFFFF">
          {/* Letter M */}
          <path d="M5.5 8.5h3.4l3.9 10.5L16.7 8.5h3.4v19h-3.3v-12.2l-4 12.2h-1.8l-4-12.2V27.5H5.5V8.5z" />
          
          {/* Letter D */}
          <path d="M22.5 8.5h6.5c4.8 0 7.5 2.8 7.5 9.5s-2.7 9.5-7.5 9.5h-6.5V8.5zm3.3 3.3v12.4h3.2c2.6 0 4.1-1.6 4.1-6.2s-1.5-6.2-4.1-6.2h-3.2z" />
        </g>
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = "", to = "/" }) => {
  // size map: sm=28px, md=36px, lg=44px
  const iconSizes = { sm: 28, md: 36, lg: 44 };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  const content = (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <LogoIcon size={iconSizes[size]} />
      {showText && (
        <span className={`font-bold tracking-tight ${textSizes[size]}`}>
          <span className="text-white">Mohit</span>
          <span className="gradient-text">Decodes</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-flex items-center group">{content}</Link>;
  }

  return content;
};

export default BrandLogo;
