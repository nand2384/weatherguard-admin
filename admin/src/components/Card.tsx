import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl glass-panel',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
