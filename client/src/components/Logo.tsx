import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  to?: string;
}

/**
 * Compact Icon component using the official MohitDecodes logo image.
 */
export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-[#0a071b] border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all duration-200 group-hover:scale-105 group-hover:border-purple-400 group-hover:shadow-[0_0_18px_rgba(168,85,247,0.45)] ${className}`}
    >
      <img
        src="/logo.png"
        alt="MohitDecodes Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover select-none"
        loading="eager"
      />
    </div>
  );
};

/**
 * Primary BrandLogo component for Navbar, Footer, Admin, and Auth pages.
 * Seamlessly integrates the official MohitDecodes logo with crisp responsive scaling.
 */
export const BrandLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  to = '/'
}) => {
  // size map for responsive icon heights: sm=32px, md=40px, lg=46px, xl=54px
  const iconSizes = { sm: 32, md: 40, lg: 46, xl: 54 };
  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg lg:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <LogoIcon size={iconSizes[size]} />
      {showText && (
        <span className={`font-extrabold tracking-tight select-none leading-tight ${textSizes[size]}`}>
          <span className="text-slate-900 dark:text-white transition-colors">Mohit</span>
          <span className="gradient-text ml-0.5">Decodes</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center group cursor-pointer" aria-label="MohitDecodes Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
