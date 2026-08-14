import React from 'react';

interface YouTubeIconProps {
  className?: string;
  size?: number;
}

/**
 * Pixel-perfect official YouTube red logo with crisp solid white play triangle.
 */
export const YouTubeIcon: React.FC<YouTubeIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 28 20"
      width={size}
      height={size ? (size * 20) / 28 : undefined}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Official YouTube Red Rounded Rectangle */}
      <path
        d="M27.42 3.065C27.098 1.86 26.15 0.913 24.945 0.591 22.763 0 14 0 14 0S5.237 0 3.055.591C1.85 0.913.902 1.86.58 3.065 0 5.253 0 9.818 0 9.818s0 4.565.58 6.753c.322 1.205 1.27 2.152 2.475 2.474 2.182.591 10.945.591 10.945.591s8.763 0 10.945-.591c1.205-.322 2.153-1.269 2.475-2.474.58-2.188.58-6.753.58-6.753s0-4.565-.58-6.753z"
        fill="#FF0000"
      />
      {/* Sharp Solid White Play Triangle */}
      <polygon points="11.2,14 18.2,9.818 11.2,5.636" fill="#FFFFFF" />
    </svg>
  );
};

export default YouTubeIcon;
