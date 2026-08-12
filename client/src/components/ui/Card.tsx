import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'ref'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      className={`rounded-2xl border border-dark-800 bg-dark-900/50 p-6 backdrop-blur-sm ${
        hoverEffect ? 'hover:border-primary-500/50 hover:bg-dark-900/80 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
