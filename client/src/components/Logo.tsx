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
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-white p-0.5 shadow-[0_0_12px_rgba(255,255,255,0.2)] border border-slate-200 ${className}`}
      style={{ width: size + 4, height: size + 4 }}
    >
      <img
        src="/logo-md-icon.png"
        alt="MohitDecodes MD Logo"
        style={{ width: size, height: size }}
        className="object-contain rounded-lg transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export const BrandLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = "", to = "/" }) => {
  const iconSizes = { sm: 26, md: 34, lg: 42 };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={iconSizes[size]} />
      {showText && (
        <span className={`font-bold tracking-tight text-slate-100 ${textSizes[size]}`}>
          Mohit<span className="gradient-text">Decodes</span>
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
