import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  to?: string;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/logo-md-icon.png"
        alt="MohitDecodes MD Logo"
        style={{ width: size, height: size }}
        className="object-contain rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export const BrandLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = "", to = "/" }) => {
  const iconSizes = { sm: 28, md: 36, lg: 44 };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSizes[size]} />
      {showText && (
        <span className={`font-bold tracking-tight text-slate-100 ${textSizes[size]}`}>
          Mohit<span className="gradient-text">Decodes</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-flex items-center">{content}</Link>;
  }

  return content;
};

export default BrandLogo;
