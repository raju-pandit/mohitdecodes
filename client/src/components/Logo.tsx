import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  to?: string;
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/logo-icon-transparent.png"
        alt="MohitDecodes Logo"
        style={{ width: size, height: 'auto' }}
        className="object-contain filter drop-shadow-[0_0_8px_rgba(147,51,234,0.4)] transition-transform duration-200 hover:scale-105"
        onError={(e) => {
          // Fallback SVG if image not found
          const target = e.target as HTMLElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('svg')) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', String(size));
            svg.setAttribute('height', String(size));
            svg.setAttribute('fill', 'none');
            svg.innerHTML = `
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#lightning-grad-fallback)" />
              <defs>
                <linearGradient id="lightning-grad-fallback" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#a855f7" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
            `;
            parent.appendChild(svg);
          }
        }}
      />
    </div>
  );
};

export const BrandLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = "", to = "/" }) => {
  const iconSizes = { sm: 24, md: 32, lg: 40 };
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
