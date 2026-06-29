import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg focus:outline-none overflow-hidden",
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              className
            )}
            onClick={() => setIsOpen(false)} // close on click
          >
            <div className="py-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}
