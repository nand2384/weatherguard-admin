import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'pending' | 'approved' | 'neutral';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset',
          {
            'bg-amber-50 text-amber-700 ring-amber-600/20': variant === 'pending',
            'bg-emerald-50 text-emerald-700 ring-emerald-600/20': variant === 'approved',
            'bg-slate-50 text-slate-700 ring-slate-600/20': variant === 'neutral',
          },
          className
        )}
        {...props}
      >
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-amber-500': variant === 'pending',
            'bg-emerald-500': variant === 'approved',
            'bg-slate-400': variant === 'neutral',
          })}
        />
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
