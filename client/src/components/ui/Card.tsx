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
      className={`rounded-2xl border border-slate-200/90 dark:border-dark-800 bg-white dark:bg-dark-900/50 text-slate-900 dark:text-slate-100 p-6 backdrop-blur-sm ${
        hoverEffect ? 'hover:border-purple-500/40 dark:hover:border-primary-500/50 hover:shadow-xl dark:hover:bg-dark-900/80 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
