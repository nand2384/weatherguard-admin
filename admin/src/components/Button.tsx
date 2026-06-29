import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: props.disabled ? 1 : 1.01 }}
        whileTap={{ scale: props.disabled ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-slate-900 text-white hover:bg-slate-800 shadow-sm': variant === 'primary',
            'bg-white/40 backdrop-blur-md text-slate-800 hover:bg-white/60 border border-white/60 shadow-sm': variant === 'secondary',
            'border border-slate-300/60 bg-white/20 text-slate-700 hover:bg-white/50 shadow-sm backdrop-blur-md': variant === 'outline',
            'bg-transparent text-slate-700 hover:bg-white/40': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
